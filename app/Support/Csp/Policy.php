<?php

declare(strict_types=1);

namespace App\Support\Csp;

use Spatie\Csp\Directive;
use Spatie\Csp\Keyword;
use Spatie\Csp\Presets\Basic;

class Policy extends Basic
{
    public function configure(): void
    {
        parent::configure();

        $this
            ->addDirective(Directive::SCRIPT, [
                Keyword::UNSAFE_EVAL,
                Keyword::UNSAFE_INLINE,
                'https://cdn.jsdelivr.net',
            ])
            ->addDirective(Directive::STYLE, [
                Keyword::UNSAFE_INLINE,
                'https://fonts.googleapis.com',
            ])
            ->addDirective(Directive::FONT, [
                'https://fonts.gstatic.com',
                Keyword::SELF,
                'data:',
            ])
            ->addDirective(Directive::IMG, [
                Keyword::SELF,
                'data:',
                'https:',
            ])
            ->addDirective(Directive::CONNECT, [
                Keyword::SELF,
                'https:',
                'wss:',
            ]);
    }
}
