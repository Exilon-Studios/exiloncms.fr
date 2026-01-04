<?php

namespace ExilonCMS\Http\Requests;

use ExilonCMS\Http\Requests\Traits\ConvertCheckbox;
use ExilonCMS\Rules\Slug;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RedirectRequest extends FormRequest
{
    use ConvertCheckbox;

    /**
     * The attributes represented by checkboxes.
     *
     * @var array<int, string>
     */
    protected array $checkboxes = [
        'is_enabled',
    ];

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $redirect = $this->route('redirect');

        return [
            'source' => ['required', 'string', 'max:100', new Slug(true), Rule::unique('redirects')->ignore($redirect, 'source')],
            'destination' => ['required', 'string', 'max:255'],
            'code' => ['required', 'in:301,302'],
            'is_enabled' => ['filled', 'boolean'],
        ];
    }
}
