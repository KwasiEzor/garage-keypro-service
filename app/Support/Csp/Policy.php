<?php

declare(strict_types=1);

namespace App\Support\Csp;

use Spatie\Csp\Directive;
use Spatie\Csp\Keyword;
use Spatie\Csp\Presets\Basic;

class Policy extends Basic
{
    public function configure(\Spatie\Csp\Policy $policy): void
    {
        parent::configure($policy);

        $policy
            ->add(Directive::SCRIPT, [
                Keyword::UNSAFE_EVAL,
                Keyword::UNSAFE_INLINE,
                'https://cdn.jsdelivr.net',
            ])
            ->add(Directive::STYLE, [
                Keyword::UNSAFE_INLINE,
                'https://fonts.googleapis.com',
            ])
            ->add(Directive::FONT, [
                'https://fonts.gstatic.com',
                Keyword::SELF,
                'data:',
            ])
            ->add(Directive::IMG, [
                Keyword::SELF,
                'data:',
                'https:',
            ])
            ->add(Directive::CONNECT, [
                Keyword::SELF,
                'https:',
                'wss:',
            ]);
    }
}
