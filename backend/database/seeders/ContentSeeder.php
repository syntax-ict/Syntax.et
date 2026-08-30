<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CustomerProblem;
use App\Models\Project;
use App\Models\Service;
use App\Models\SolutionCategory;
use Illuminate\Database\Seeder;

/**
 * Sample content for local development and manual QA — a handful of
 * representative rows per table, not a full transcription of the existing
 * frontend's marketing copy. Porting that copy verbatim is a content task
 * best done through the admin panel (Phase 5) or a dedicated one-off import
 * script once that copy is finalized, not hand-duplicated into a seeder here.
 */
class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $security = SolutionCategory::query()->updateOrCreate(
            ['slug' => 'security-smart-systems'],
            [
                'name' => 'Security & Smart Systems',
                'short_description' => 'CCTV, biometrics, access control, and GPS fleet tracking.',
                'detailed_description' => 'Integrated surveillance and access-control systems for organizations that need accurate, auditable physical security.',
                'icon' => 'Shield',
                'color_primary' => 'bg-blue-600',
                'color_bg' => 'bg-blue-50',
                'color_border' => 'border-blue-100',
                'color_accent' => 'text-blue-600',
                'sort_order' => 1,
            ]
        );

        $tech = SolutionCategory::query()->updateOrCreate(
            ['slug' => 'technology-solutions'],
            [
                'name' => 'Technology Solutions',
                'short_description' => 'IT infrastructure, networking, and ongoing technical support.',
                'detailed_description' => 'Structured cabling, network overhauls, and monthly maintenance SLAs for growing organizations.',
                'icon' => 'Network',
                'color_primary' => 'bg-emerald-600',
                'color_bg' => 'bg-emerald-50',
                'color_border' => 'border-emerald-100',
                'color_accent' => 'text-emerald-600',
                'sort_order' => 2,
            ]
        );

        $cctv = Service::query()->updateOrCreate(
            ['slug' => 'cctv-surveillance'],
            [
                'solution_category_id' => $security->id,
                'name' => 'CCTV Surveillance Design',
                'short_description' => 'IP camera networks with NVR storage and remote viewing.',
                'description' => 'Design and installation of IP-based CCTV systems, including camera placement planning, structured cabling, and NVR configuration.',
                'icon' => 'Camera',
                'benefits' => ['Night-vision coverage', 'Remote mobile viewing', 'Motion-based alerts'],
                'is_featured' => true,
                'sort_order' => 1,
            ]
        );

        $cctv->faqs()->updateOrCreate(
            ['question' => 'Is remote viewing free?'],
            [
                'answer' => 'Yes. The manufacturer mobile app is free; data only travels over your own internet connection.',
                'sort_order' => 1,
            ]
        );

        CustomerProblem::query()->updateOrCreate(
            ['problem' => 'Unmonitored entry points'],
            [
                'solution_category_id' => $security->id,
                'target_user' => 'Facility managers',
                'impact' => 'Unauthorized access goes undetected and cannot be audited after the fact.',
                'solution_text' => 'Integrated CCTV and biometric access control with a continuous audit trail.',
                'sort_order' => 1,
            ]
        );

        Course::query()->updateOrCreate(
            ['slug' => 'cctv-surveillance-design-training'],
            [
                'solution_category_id' => $security->id,
                'title' => 'CCTV Surveillance Design & Biometric Integration',
                'duration' => '4 weeks',
                'level' => 'intermediate',
                'mode' => 'face_to_face',
                'description' => 'Hands-on lab training covering camera placement, structured cabling, and NVR configuration.',
                'syllabus' => ['Lens optics & placement planning', 'Structured cabling essentials', 'NVR configuration', 'Biometric wiring'],
                'skills_gained' => ['Camera network design', 'NVR administration', 'Access control wiring'],
                'price_amount' => 350.00,
                'price_currency' => 'ETB',
                'sort_order' => 1,
            ]
        );

        $project = Project::query()->updateOrCreate(
            ['slug' => 'integrated-ip-surveillance-biometric-gates'],
            [
                'solution_category_id' => $security->id,
                'title' => 'Integrated IP Surveillance & Biometric Gates Setup',
                'client_type' => 'government',
                'industry' => 'Public administration',
                'description' => 'Full-site CCTV and biometric access control deployment across 8 external entry points.',
                'deliverables' => ['32-channel NVR stack', 'Biometric turnstiles at 8 entry points', 'Mobile monitoring app'],
                'results' => ['Digitized 100% of employee entry/exit timestamps'],
                'is_featured' => true,
                'sort_order' => 1,
            ]
        );

        $project->images()->firstOrCreate([
            'disk_path' => 'project-images/placeholder-front-gate.jpg',
            'alt_text' => 'Front gate biometric turnstile installation',
        ]);

        Service::query()->updateOrCreate(
            ['slug' => 'it-infrastructure'],
            [
                'solution_category_id' => $tech->id,
                'name' => 'IT Infrastructure & Networking',
                'short_description' => 'Structured cabling, switch racks, and router configuration.',
                'description' => 'Office network overhauls delivering Gigabit capability, secure WAN partitioning, and rack management.',
                'icon' => 'Network',
                'benefits' => ['Gigabit network speeds', 'Secure WAN partitioning', 'Documented rack layouts'],
                'sort_order' => 1,
            ]
        );
    }
}
