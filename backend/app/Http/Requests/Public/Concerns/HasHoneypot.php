<?php

namespace App\Http\Requests\Public\Concerns;

use App\Support\SecurityLog;
use Illuminate\Validation\Validator;

/**
 * Simple honeypot spam protection for the public write forms.
 *
 * `website_url` is never rendered by the real frontend form (or is rendered
 * hidden via CSS) — a human never fills it, but a naive bot filling every
 * field it finds does. `prohibited` rejects the request outright if the
 * field is present and non-empty, with the same 422 shape as any other
 * validation failure — nothing distinguishes a spam rejection from an
 * honest mistake, which is deliberate: it doesn't tell a bot what tripped.
 *
 * This is the honeypot named in the architecture's validation rules
 * (§6) as a substitute for a CAPTCHA that would need an external API key
 * this application doesn't have configured.
 */
trait HasHoneypot
{
    /**
     * @return array<string, mixed>
     */
    protected function honeypotRules(): array
    {
        return [
            'website_url' => ['prohibited'],
        ];
    }

    /**
     * Laravel calls this automatically if a FormRequest defines it. Logging
     * happens here (once a honeypot trip is confirmed) rather than at the
     * generic validation-exception handler, since that handler has no way
     * to tell a spam rejection apart from an honest mistake — nor should
     * the response to the client differ; only the log does.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($validator->errors()->has('website_url')) {
                SecurityLog::spamSubmissionBlocked(class_basename($this), $this);
            }
        });
    }
}
