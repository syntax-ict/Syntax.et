<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Support\ApiResponse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Shared CRUD shape for the content management resources (architecture
 * §2/§1/§3/§4/§10: solution categories, services, customer problems,
 * courses, projects, pages) — all six are the same `apiResource` pattern
 * with the same authorization rule (staff read, admin write). A subclass
 * only has to say what model/resource it is and what its validation rules
 * are; this keeps six otherwise near-identical controllers from
 * duplicating the same index/store/show/update/destroy logic six times.
 *
 * Validation rules live in a plain method rather than a dedicated
 * FormRequest per resource, because the one thing that varies between
 * create and update (a unique-slug check that must ignore the current row)
 * needs the record being updated, which a subclass method can take as a
 * parameter far more simply than six FormRequest classes each reaching
 * into the route for it.
 *
 * `destroy()` is a soft toggle (the $activeColumn flipped false), not a
 * hard delete — matching the architecture's read that most content edits
 * are "unpublish", not "erase" (§C: "destroy on content resources is a
 * soft-delete or is_active=false toggle... except for genuinely disposable
 * records").
 */
abstract class AdminCrudController extends Controller
{
    use ApiResponse;

    /** @var class-string<Model> */
    protected string $activeColumn = 'is_active';

    /**
     * @return class-string<Model>
     */
    abstract protected function modelClass(): string;

    /**
     * @return class-string
     */
    abstract protected function resourceClass(): string;

    /**
     * @return array<string, mixed>
     */
    abstract protected function rules(?Model $existing): array;

    /**
     * @return array<int, string>
     */
    protected function with(): array
    {
        return [];
    }

    protected function orderBy(): string
    {
        return 'sort_order';
    }

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', $this->modelClass());

        $query = $this->modelClass()::query();
        foreach ($this->with() as $relation) {
            $query->with($relation);
        }

        $items = $query->orderBy($this->orderBy())->paginate(50);

        return $this->ok($this->resourceClass()::collection($items));
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', $this->modelClass());

        $data = $request->validate($this->rules(null));
        $item = $this->modelClass()::query()->create($data);

        if ($this->with() !== []) {
            $item->load($this->with());
        }

        return $this->created(new ($this->resourceClass())($item));
    }

    public function show(int $id): JsonResponse
    {
        $item = $this->modelClass()::query()->with($this->with())->findOrFail($id);
        $this->authorize('view', $item);

        return $this->ok(new ($this->resourceClass())($item));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = $this->modelClass()::query()->findOrFail($id);
        $this->authorize('update', $item);

        $data = $request->validate($this->rules($item));
        $item->update($data);

        if ($this->with() !== []) {
            $item->load($this->with());
        }

        return $this->ok(new ($this->resourceClass())($item));
    }

    public function destroy(int $id): JsonResponse
    {
        $item = $this->modelClass()::query()->findOrFail($id);
        $this->authorize('delete', $item);

        $item->update([$this->activeColumn => false]);

        return $this->noContent();
    }
}
