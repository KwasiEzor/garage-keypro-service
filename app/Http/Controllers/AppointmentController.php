<?php

namespace App\Http\Controllers;

use App\Exceptions\SlotUnavailableException;
use App\Http\Requests\StoreAppointmentRequest;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\Team;
use App\Notifications\AppointmentConfirmation;
use App\Services\AppointmentService;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\CalendarLinks\Link;

class AppointmentController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected AppointmentService $appointmentService
    ) {}

    /**
     * Show the booking page.
     */
    public function index(): Response
    {
        return Inertia::render('appointments/index', [
            'services' => Service::where('is_active', true)->get(),
            'teams' => Team::all(),
            'availableSlots' => Inertia::optional(function () {
                if (request('date') && request('team_id') && request('service_id')) {
                    $team = Team::find(request('team_id'));
                    $service = Service::find(request('service_id'));
                    $date = Carbon::parse(request('date'));

                    return $this->appointmentService->getAvailableSlots($team, $date, $service);
                }

                return [];
            }),
        ]);
    }

    /**
     * Get available slots for a specific date and service.
     */
    public function slots(Request $request)
    {
        $request->validate([
            'team_id' => 'required|exists:teams,id',
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date|after_or_equal:today',
        ]);

        $team = Team::findOrFail($request->team_id);
        $service = Service::findOrFail($request->service_id);
        $date = Carbon::parse($request->date);

        $slots = $this->appointmentService->getAvailableSlots($team, $date, $service);

        return response()->json([
            'slots' => $slots,
        ]);
    }

    /**
     * Get monthly availability overview for a team and service.
     * Returns slot counts per day to power calendar indicators.
     */
    public function availability(Request $request)
    {
        $request->validate([
            'team_id' => 'required|exists:teams,id',
            'service_id' => 'required|exists:services,id',
            'month' => 'required|date_format:Y-m',
        ]);

        $team = Team::findOrFail($request->team_id);
        $service = Service::findOrFail($request->service_id);
        $month = Carbon::parse($request->month.'-01');

        // Cache key for this combination
        $cacheKey = "availability:{$team->id}:{$service->id}:{$month->format('Y-m')}";

        $availability = cache()->remember($cacheKey, now()->addMinutes(5), function () use ($team, $service, $month) {
            $daysInMonth = $month->daysInMonth;
            $result = [];
            $today = Carbon::today();

            for ($day = 1; $day <= $daysInMonth; $day++) {
                $date = $month->copy()->day($day);

                // Skip past dates
                if ($date->lt($today)) {
                    continue;
                }

                $slots = $this->appointmentService->getAvailableSlots($team, $date, $service);
                $slotCount = count($slots);

                if ($slotCount > 0) {
                    $result[$date->format('Y-m-d')] = [
                        'slots' => $slotCount,
                        'first' => $slots[0]['start_time'] ?? null,
                    ];
                }
            }

            return $result;
        });

        return response()->json([
            'availability' => $availability,
        ]);
    }

    /**
     * Store a new appointment.
     */
    public function store(StoreAppointmentRequest $request)
    {
        $validated = $request->validated();

        $team = Team::findOrFail($validated['team_id']);
        $service = Service::findOrFail($validated['service_id']);
        $startAt = Carbon::parse($validated['date'].' '.$validated['slot']);

        try {
            $appointment = $this->appointmentService->createAppointment(
                $team,
                auth()->user(),
                $service,
                $startAt,
                $validated['notes'] ?? null
            );

            // Send confirmation email with calendar attachment
            auth()->user()->notify(new AppointmentConfirmation($appointment));

            $link = Link::create(
                $service->name.' - '.$team->name,
                $appointment->start_at,
                $appointment->end_at
            )
                ->description($appointment->notes ?? '')
                ->address($team->name);

            return redirect()->route('appointments.show', $appointment)->with([
                'success' => 'Appointment confirmed! Check your email for details.',
                'calendar_links' => [
                    'google' => $link->google(),
                    'yahoo' => $link->yahoo(),
                    'outlook' => $link->webOutlook(),
                    'office365' => $link->webOffice(),
                ],
            ]);
        } catch (SlotUnavailableException $e) {
            return back()
                ->withInput()
                ->withErrors(['slot' => 'This time slot is no longer available. Please choose another.']);
        }
    }

    /**
     * Show user's appointments with tabs for upcoming, past, and cancelled.
     */
    public function myAppointments(): Response
    {
        $user = auth()->user();

        return Inertia::render('appointments/my-appointments', [
            'upcoming' => $user->appointments()->with(['team', 'service'])->upcoming()->get(),
            'past' => $user->appointments()->with(['team', 'service'])->past()->get(),
            'cancelled' => $user->appointments()->with(['team', 'service'])->cancelled()->get(),
        ]);
    }

    /**
     * Show appointment details.
     */
    public function show(Appointment $appointment): Response
    {
        Gate::authorize('view', $appointment);

        return Inertia::render('appointments/show', [
            'appointment' => $appointment->load(['team', 'service', 'user']),
        ]);
    }

    /**
     * Cancel an appointment.
     */
    public function cancel(Appointment $appointment)
    {
        Gate::authorize('cancel', $appointment);

        $this->appointmentService->cancelAppointment(
            $appointment,
            request('reason') ?? 'Cancelled by user'
        );

        return redirect()->route('appointments.my')
            ->with('success', 'Appointment cancelled successfully.');
    }

    /**
     * Show reschedule page with wizard pre-filled.
     */
    public function reschedule(Appointment $appointment): Response
    {
        Gate::authorize('reschedule', $appointment);

        return Inertia::render('appointments/index', [
            'services' => Service::where('is_active', true)->get(),
            'teams' => Team::all(),
            'rescheduleAppointment' => $appointment->load(['team', 'service']),
        ]);
    }

    /**
     * Process appointment reschedule.
     */
    public function processReschedule(Appointment $appointment, StoreAppointmentRequest $request)
    {
        Gate::authorize('reschedule', $appointment);

        $validated = $request->validated();

        $team = Team::findOrFail($validated['team_id']);
        $service = Service::findOrFail($validated['service_id']);
        $startAt = Carbon::parse($validated['date'].' '.$validated['slot']);

        try {
            DB::transaction(function () use ($appointment, $team, $service, $startAt, $validated) {
                // Lock appointment to prevent concurrent reschedule race condition
                $lockedAppointment = Appointment::where('id', $appointment->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                // Cancel old appointment
                $this->appointmentService->cancelAppointment(
                    $lockedAppointment,
                    'Rescheduled to new time'
                );

                // Create new appointment
                $newAppointment = $this->appointmentService->createAppointment(
                    $team,
                    auth()->user(),
                    $service,
                    $startAt,
                    $validated['notes'] ?? null
                );

                // Send confirmation email
                auth()->user()->notify(new AppointmentConfirmation($newAppointment));

                return $newAppointment;
            });

            return redirect()->route('appointments.my')
                ->with('success', 'Appointment rescheduled successfully.');
        } catch (SlotUnavailableException $e) {
            return back()
                ->withInput()
                ->withErrors(['slot' => 'This time slot is no longer available. Please choose another.']);
        }
    }

    /**
     * Download calendar file for appointment.
     */
    public function downloadCalendar(Appointment $appointment)
    {
        Gate::authorize('view', $appointment);

        $link = Link::create(
            $appointment->service->name,
            $appointment->start_at,
            $appointment->end_at
        )
            ->description($appointment->notes ?? '')
            ->address($appointment->team->name);

        $icsContent = $link->ics([
            'UID' => "appointment-{$appointment->id}@".config('app.url'),
        ], ['format' => 'file']);

        return response()->streamDownload(
            fn () => print $icsContent,
            "appointment-{$appointment->id}.ics",
            ['Content-Type' => 'text/calendar; charset=utf-8']
        );
    }
}
