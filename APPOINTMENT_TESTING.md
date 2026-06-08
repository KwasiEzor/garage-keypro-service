# Appointment Booking - Manual Testing Guide

## Issues Fixed

### 1. React Component Crash
- **Problem**: `ShieldCheckIcon` import caused runtime error
- **Fix**: Updated all lucide-react icon imports (removed "Icon" suffix)
- **Test**: Page should load without JavaScript errors

### 2. SSR Hydration Mismatch
- **Problem**: localStorage read during initial render caused server/client mismatch
- **Fix**: Defer localStorage restore until after hydration
- **Test**: No hydration errors in console

### 3. Date Picker Bugs
- **Problem**: Date comparison and calendar rendering issues
- **Fix**: Use `startOfDay()` for date comparison, removed broken custom Day component
- **Test**: Calendar displays as grid, dates are clickable

## Manual Testing Steps

### Prerequisites
1. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+F5)
2. Clear localStorage if needed: `localStorage.clear()`
3. Open browser console to check for errors

### Test Flow

#### Step 1: Visit Appointments Page
```
URL: https://garage-keypro-service.test/appointments
```
**Expected**:
- Page loads without errors
- Services display in 2-column grid
- Step indicator shows "Step 1"
- No hydration errors in console

#### Step 2: Select Service
**Action**: Click on any active service card

**Expected**:
- Service card highlights
- Step indicator advances to "Step 2"
- Step 1 shows checkmark
- Calendar and timezone selector appear

#### Step 3: Select Date
**Action**: Click on an available date in the calendar

**Expected**:
- Calendar displays as grid (not vertical list)
- Available dates have red dots
- Past dates are grayed out and disabled
- Clicking date shows time slots on right side
- Selected date displays above time slots

**Debug if no dates available**:
```bash
# Check if business hours are configured
php artisan tinker
>>> App\Models\Team::find(8)->businessHours;
```

#### Step 4: Select Time Slot
**Action**: Click on an available time slot

**Expected**:
- Time slots display in grid
- Available slots are clickable
- Selected slot highlights in red
- "Next" button becomes enabled

#### Step 5: Fill Details (Optional)
**Action**: Navigate to Step 3

**Expected**:
- Notes textarea appears
- Can enter additional information
- Can skip and proceed to review

#### Step 6: Review & Submit
**Action**: Navigate to Step 4, review details, click submit

**Expected**:
- All booking details display correctly
- Submit button works
- Redirects to confirmation/dashboard
- Appointment saved to database

## Console Errors to Check

### ✅ Should NOT see:
- ❌ `ShieldCheckIcon is not defined`
- ❌ `Hydration failed because the server rendered HTML didn't match`
- ❌ Invalid Date errors
- ❌ React component errors

### ✓ Should see:
- ✅ No errors in console
- ✅ Calendar renders as proper grid
- ✅ Dates are clickable
- ✅ Time slots load when date selected

## API Endpoints Test

### Test Availability Endpoint
```bash
# Get first service and team
php artisan tinker
>>> $service = App\Models\Service::where('is_active', true)->first();
>>> $team = App\Models\Team::where('is_personal', false)->first();
>>> echo "Service ID: {$service->id}, Team ID: {$team->id}";

# Test in browser or curl
curl "https://garage-keypro-service.test/appointments/availability?team_id=8&service_id=4&month=2026-06"
```

**Expected Response**:
```json
{
  "availability": {
    "2026-06-15": {"slots": 12, "first": "09:00:00"},
    "2026-06-16": {"slots": 10, "first": "09:00:00"}
  }
}
```

### Test Slots Endpoint
```bash
curl "https://garage-keypro-service.test/appointments/slots?team_id=8&service_id=4&date=2026-06-15"
```

**Expected Response**:
```json
{
  "slots": [
    {
      "start_time": "09:00:00",
      "end_time": "10:00:00",
      "is_available": true
    }
  ]
}
```

## Troubleshooting

### No Available Dates
**Issue**: Calendar shows no available dates

**Solutions**:
1. Check business hours are configured for team
2. Verify service is active
3. Check date range (only shows 3 months ahead)

```bash
php artisan tinker
>>> App\Models\Team::find(8)->businessHours()->get();
```

### Calendar Not Clickable
**Issue**: Dates don't respond to clicks

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify react-day-picker CSS is loaded
3. Clear cache and hard refresh

### Hydration Warnings
**Issue**: Still seeing hydration mismatch errors

**Solutions**:
1. Clear localStorage: `localStorage.clear()`
2. Hard refresh browser
3. Verify latest build is deployed

## Database Verification

### Check Created Appointments
```bash
php artisan tinker
>>> App\Models\Appointment::latest()->take(5)->get(['id', 'user_id', 'service_id', 'start_at', 'status']);
```

### Verify Appointment Details
```bash
php artisan tinker
>>> $apt = App\Models\Appointment::latest()->first();
>>> echo "Service: {$apt->service->name}\n";
>>> echo "User: {$apt->user->name}\n";
>>> echo "Start: {$apt->start_at}\n";
>>> echo "Status: {$apt->status}\n";
```

## Success Criteria

- ✅ Page loads without errors
- ✅ No hydration errors in console
- ✅ Calendar displays as grid
- ✅ Dates are clickable
- ✅ Time slots load on date selection
- ✅ Appointment saves to database
- ✅ User receives confirmation
