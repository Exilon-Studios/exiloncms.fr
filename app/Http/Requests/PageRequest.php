<?php

namespace ExilonCMS\Http\Requests;

use ExilonCMS\Http\Requests\Traits\ConvertCheckbox;
use ExilonCMS\Rules\Slug;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PageRequest extends FormRequest
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
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->mergeCheckboxes();

        if (! $this->filled('restricted')) {
            $this->merge(['roles' => null]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $page = $this->route('page');

        // If this is a Puck editor update (only puck_data field)
        if ($this->has('puck_data') && count($this->all()) === 1) {
            return [
                'puck_data' => ['required', 'string'],
            ];
        }

        return [
            'title' => ['required', 'string', 'max:150'],
            'description' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:100', new Slug(true), Rule::unique('pages')->ignore($page, 'slug')],
            'content' => ['required', 'string'],
            'is_enabled' => ['filled', 'boolean'],
            'roles.*' => ['required', 'integer', 'exists:roles,id'],
        ];
    }
}
