<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ $subject ?? 'GarageKeyPro' }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #2D3748;
            background-color: #F7FAFC;
            padding: 20px;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            background: linear-gradient(135deg, {{ \App\Models\Setting::get('email_primary_color', '#4C8BF5') }} 0%, #3B7AE5 100%);
            padding: 40px 30px;
            text-align: center;
        }

        .email-logo {
            max-width: 180px;
            height: auto;
            margin-bottom: 20px;
        }

        .email-header-title {
            color: #FFFFFF;
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
        }

        .email-body {
            padding: 40px 30px;
        }

        .email-greeting {
            font-size: 18px;
            font-weight: 600;
            color: #2D3748;
            margin-bottom: 20px;
        }

        .email-content {
            font-size: 16px;
            color: #4A5568;
            line-height: 1.8;
            margin-bottom: 20px;
        }

        .email-content p {
            margin-bottom: 16px;
        }

        .email-content ul {
            margin: 16px 0;
            padding-left: 20px;
        }

        .email-content li {
            margin-bottom: 8px;
        }

        .button-primary {
            display: inline-block;
            padding: 14px 32px;
            background-color: {{ \App\Models\Setting::get('email_accent_color', '#FF6700') }};
            color: #FFFFFF !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 14px 0 rgba(255, 103, 0, 0.39);
            transition: all 0.3s ease;
        }

        .button-primary:hover {
            background-color: #E55D00;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px 0 rgba(255, 103, 0, 0.5);
        }

        .info-box {
            background-color: #EBF8FF;
            border-left: 4px solid {{ \App\Models\Setting::get('email_primary_color', '#4C8BF5') }};
            padding: 20px;
            margin: 20px 0;
            border-radius: 6px;
        }

        .info-box-title {
            font-weight: 600;
            color: #2C5282;
            margin-bottom: 10px;
            font-size: 16px;
        }

        .info-box-content {
            color: #2C5282;
            font-size: 15px;
        }

        .detail-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        .detail-table td {
            padding: 12px;
            border-bottom: 1px solid #E2E8F0;
        }

        .detail-table td:first-child {
            font-weight: 600;
            color: #4A5568;
            width: 40%;
        }

        .detail-table td:last-child {
            color: #2D3748;
        }

        .email-divider {
            height: 1px;
            background-color: #E2E8F0;
            margin: 30px 0;
        }

        .email-footer {
            background-color: #F7FAFC;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #E2E8F0;
        }

        .email-footer-text {
            font-size: 14px;
            color: #718096;
            margin-bottom: 15px;
            line-height: 1.6;
        }

        .email-footer-contact {
            font-size: 13px;
            color: #A0AEC0;
            margin-top: 10px;
        }

        .email-footer-contact a {
            color: {{ \App\Models\Setting::get('email_primary_color', '#4C8BF5') }};
            text-decoration: none;
        }

        .email-footer-social {
            margin-top: 20px;
        }

        .email-footer-social a {
            display: inline-block;
            margin: 0 8px;
            color: #718096;
            text-decoration: none;
        }

        .text-muted {
            color: #A0AEC0;
            font-size: 14px;
        }

        .text-center {
            text-align: center;
        }

        .mt-20 {
            margin-top: 20px;
        }

        .mb-20 {
            margin-bottom: 20px;
        }

        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }

            .email-header {
                padding: 30px 20px;
            }

            .email-body {
                padding: 30px 20px;
            }

            .email-footer {
                padding: 20px;
            }

            .button-primary {
                display: block;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            @if(\App\Models\Setting::get('email_logo_url'))
                <img src="{{ \App\Models\Setting::get('email_logo_url') }}" alt="{{ \App\Models\Setting::get('email_company_name', 'GarageKeyPro') }}" class="email-logo">
            @else
                <h1 class="email-header-title">{{ \App\Models\Setting::get('email_company_name', 'GarageKeyPro') }}</h1>
            @endif
        </div>

        <!-- Body -->
        <div class="email-body">
            {{ $slot }}
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p class="email-footer-text">
                {{ \App\Models\Setting::get('email_footer_text', 'GarageKeyPro - Elite Automotive Engineering') }}
            </p>
            <div class="email-footer-contact">
                @if(\App\Models\Setting::get('email_support_email'))
                    <a href="mailto:{{ \App\Models\Setting::get('email_support_email') }}">{{ \App\Models\Setting::get('email_support_email') }}</a>
                @endif
                @if(\App\Models\Setting::get('email_support_phone'))
                    | {{ \App\Models\Setting::get('email_support_phone') }}
                @endif
            </div>
            <p class="text-muted mt-20">
                &copy; {{ date('Y') }} {{ \App\Models\Setting::get('email_company_name', 'GarageKeyPro') }}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
