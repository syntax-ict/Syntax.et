<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Resources\Admin\PageResource;
use App\Models\Page;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PageController extends AdminCrudController
{
    protected string $activeColumn = 'is_published';

    protected function modelClass(): string
    {
        return Page::class;
    }

    protected function resourceClass(): string
    {
        return PageResource::class;
    }

    protected function orderBy(): string
    {
        return 'title';
    }

    protected function rules(?Model $existing): array
    {
        return [
            'slug' => ['required', 'string', 'max:100', 'regex:/^[a-z0-9-]+$/', Rule::unique('pages', 'slug')->ignore($existing?->id)],
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:300'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', $this->modelClass());

        $data = $request->validate($this->rules(null));
        $page = Page::query()->create([...$data, 'updated_by' => $request->user()->id]);

        return $this->created(new PageResource($page));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $page = Page::query()->findOrFail($id);
        $this->authorize('update', $page);

        $data = $request->validate($this->rules($page));
        $page->update([...$data, 'updated_by' => $request->user()->id]);

        return $this->ok(new PageResource($page));
    }
}
