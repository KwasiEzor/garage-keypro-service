<?php

namespace App\Enums;

enum Role: string
{
    case Admin = 'admin';
    case Manager = 'manager';
    case Member = 'member';

    public function isAdmin(): bool
    {
        return $this === self::Admin;
    }

    public function isManager(): bool
    {
        return $this === self::Manager;
    }

    public function canAccessAdminPanel(): bool
    {
        return in_array($this, [self::Admin, self::Manager]);
    }
}
