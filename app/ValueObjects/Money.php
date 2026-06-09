<?php

declare(strict_types=1);

namespace App\ValueObjects;

use Brick\Math\RoundingMode;
use Brick\Money\Money as BrickMoney;

class Money
{
    private BrickMoney $money;

    public function __construct(BrickMoney $money)
    {
        $this->money = $money;
    }

    public static function fromDecimal(float|string $amount, string $currency): self
    {
        return new self(BrickMoney::of($amount, $currency, null, RoundingMode::HALF_UP));
    }

    public static function fromMinor(int $amount, string $currency): self
    {
        return new self(BrickMoney::ofMinor($amount, $currency));
    }

    public function getAmount(): float
    {
        return $this->money->getAmount()->toFloat();
    }

    public function getMinorAmount(): int
    {
        return $this->money->getMinorAmount()->toInt();
    }

    public function getCurrency(): string
    {
        return $this->money->getCurrency()->getCurrencyCode();
    }

    public function format(string $locale = 'en_US'): string
    {
        return $this->money->formatTo($locale);
    }

    public function add(self $other): self
    {
        return new self($this->money->plus($other->money));
    }

    public function subtract(self $other): self
    {
        return new self($this->money->minus($other->money));
    }

    public function multiply(float|string $multiplier): self
    {
        return new self($this->money->multipliedBy($multiplier, RoundingMode::HALF_UP));
    }

    public function __toString(): string
    {
        return $this->format();
    }
}
