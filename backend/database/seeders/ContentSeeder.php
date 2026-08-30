<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CustomerProblem;
use App\Models\Project;
use App\Models\Service;
use App\Models\SolutionCategory;
use Illuminate\Database\Seeder;

/**
 * Real content, ported from the frontend's data.ts/solutionsData.ts, with
 * slugs matching exactly what the frontend hard-codes in a few places
 * (InteractiveHelp's quick-links, App.tsx's category filters) so cross-
 * component navigation resolves correctly during integration testing.
 *
 * Descriptions are paraphrased rather than transcribed verbatim — a full
 * copy port is a content task for the admin panel or a dedicated import
 * script (see Phase 2's report), not something to hand-duplicate here.
 * The slugs, structure, and relationships are what integration correctness
 * actually depends on.
 */
class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $tech = SolutionCategory::query()->updateOrCreate(
            ['slug' => 'technology-solutions'],
            [
                'name' => 'Technology Solutions',
                'short_description' => 'Integrated network, software, and computing infrastructure for enterprise growth.',
                'detailed_description' => 'Syntax Technology designs, deploys, and manages international-standard IT infrastructures that eliminate operational friction.',
                'icon' => 'Cpu',
                'color_primary' => 'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
                'color_bg' => 'bg-blue-50/50',
                'color_border' => 'border-blue-100',
                'color_accent' => 'blue',
                'sort_order' => 1,
            ]
        );

        $security = SolutionCategory::query()->updateOrCreate(
            ['slug' => 'security-smart-systems'],
            [
                'name' => 'Security & Smart Systems',
                'short_description' => 'Commercial surveillance, access control, and biometrics to safeguard assets and audit operations.',
                'detailed_description' => 'Integrated CCTV, biometric attendance, and access-control systems for organizations that need accurate, auditable physical security.',
                'icon' => 'Shield',
                'color_primary' => 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
                'color_bg' => 'bg-emerald-50/50',
                'color_border' => 'border-emerald-100',
                'color_accent' => 'emerald',
                'sort_order' => 2,
            ]
        );

        $training = SolutionCategory::query()->updateOrCreate(
            ['slug' => 'professional-training'],
            [
                'name' => 'Professional Training',
                'short_description' => 'Practical, lab-based technology courses for individuals and corporate teams.',
                'detailed_description' => 'Hands-on academies covering CCTV design, enterprise networking, and office technology automation.',
                'icon' => 'GraduationCap',
                'color_primary' => 'text-purple-600 bg-purple-50 dark:bg-purple-950/30',
                'color_bg' => 'bg-purple-50/50',
                'color_border' => 'border-purple-100',
                'color_accent' => 'purple',
                'sort_order' => 3,
            ]
        );

        $businessSupport = SolutionCategory::query()->updateOrCreate(
            ['slug' => 'business-support'],
            [
                'name' => 'Business Support',
                'short_description' => 'Printing, branding, advertising, and signage for a premium physical presence.',
                'detailed_description' => 'Storefront signage, corporate print, and brand materials produced to a consistent visual standard.',
                'icon' => 'Briefcase',
                'color_primary' => 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
                'color_bg' => 'bg-amber-50/50',
                'color_border' => 'border-amber-100',
                'color_accent' => 'amber',
                'sort_order' => 4,
            ]
        );

        // The 8 detailed solution datasheets (slugs match SOLUTIONS_DATA
        // exactly — InteractiveHelp.tsx references several of these
        // directly by slug).
        $services = [
            ['slug' => 'cctv-surveillance', 'category' => $security, 'name' => 'CCTV and Surveillance', 'icon' => 'Camera',
                'short' => 'IP camera networks with NVR storage and remote viewing.',
                'desc' => 'Design and installation of IP-based CCTV systems, including camera placement planning, structured cabling, and NVR configuration.',
                'benefits' => ['Night-vision coverage', 'Remote mobile viewing', 'Motion-based alerts'],
                'faqs' => [['q' => 'Is remote viewing free?', 'a' => 'Yes. The manufacturer mobile app is free; data only travels over your own internet connection.']],
            ],
            ['slug' => 'biometric-attendance', 'category' => $security, 'name' => 'Biometric Attendance', 'icon' => 'Fingerprint',
                'short' => 'Fingerprint and face-recognition attendance terminals.',
                'desc' => 'Eliminates buddy-punching and manual timesheets with fingerprint or face-recognition clock-in terminals feeding a central payroll export.',
                'benefits' => ['Eliminates buddy punching', 'Automated payroll export', 'Offline log buffering'],
                'faqs' => [['q' => 'What happens if the network goes down?', 'a' => 'Terminals buffer up to 100,000 offline log events and sync automatically once the network is restored.']],
            ],
            ['slug' => 'access-control', 'category' => $security, 'name' => 'Access Control', 'icon' => 'Key',
                'short' => 'Card, PIN, and biometric door access systems.',
                'desc' => 'Restrict entry to sensitive areas with card, PIN, or biometric readers tied to a centralized access log.',
                'benefits' => ['Zone-based permissions', 'Full entry/exit audit trail', 'Remote lock/unlock'],
                'faqs' => [],
            ],
            ['slug' => 'gps-fleet-tracking', 'category' => $security, 'name' => 'GPS and Fleet Tracking', 'icon' => 'MapPin',
                'short' => 'Real-time vehicle tracking and geofencing.',
                'desc' => 'Concealed GPS trackers feed live speed, route, and idling data to a cloud fleet portal with geofencing and remote engine-shutdown relays.',
                'benefits' => ['Real-time location', 'Geofence alerts', 'Idling and fuel reports'],
                'faqs' => [],
            ],
            ['slug' => 'it-infrastructure', 'category' => $tech, 'name' => 'IT Infrastructure', 'icon' => 'Network',
                'short' => 'Structured cabling, switch racks, and router configuration.',
                'desc' => 'Office network overhauls delivering Gigabit capability, secure WAN partitioning, and documented rack layouts.',
                'benefits' => ['Gigabit network speeds', 'Secure WAN partitioning', 'Documented rack layouts'],
                'faqs' => [],
            ],
            ['slug' => 'networking', 'category' => $tech, 'name' => 'Networking', 'icon' => 'Network',
                'short' => 'LAN/WAN design, routing, and wireless coverage.',
                'desc' => 'End-to-end network design covering VLAN segregation, routing protocols, and wireless access point placement.',
                'benefits' => ['Segregated VLANs', 'Optimized wireless coverage', 'Perimeter VPN access'],
                'faqs' => [],
            ],
            ['slug' => 'technical-support', 'category' => $tech, 'name' => 'Technical Support', 'icon' => 'Wrench',
                'short' => 'SLA-driven ongoing hardware and software maintenance.',
                'desc' => 'Scheduled preventive maintenance and an on-call helpdesk SLA covering hardware, OS updates, and security patching.',
                'benefits' => ['Extended hardware lifespan', 'Pre-empted failures', 'Dedicated helpdesk SLA'],
                'faqs' => [],
            ],
            ['slug' => 'software-system-integration', 'category' => $tech, 'name' => 'Software and System Integration', 'icon' => 'Combine',
                'short' => 'Unifying multi-vendor systems into one managed ecosystem.',
                'desc' => 'Integrates disparate hardware, cloud services, and workflows into a single manageable system, reducing duplicate data entry.',
                'benefits' => ['Reduced administrative overhead', 'Synchronized cross-department data', 'Centralized permissions'],
                'faqs' => [],
            ],
            // Additional homepage-level services for the two pillars without
            // a dedicated SOLUTIONS_DATA detail page.
            ['slug' => 'corporate-group-training', 'category' => $training, 'name' => 'Corporate Group Training', 'icon' => 'Users',
                'short' => 'On-site or online technology training for teams.',
                'desc' => 'Custom cohort training delivered on-site or online, covering the same practical syllabus as the public course catalog.',
                'benefits' => ['Tailored to your team', 'On-site or online delivery', 'Certificate of completion'],
                'faqs' => [],
            ],
            ['slug' => 'printing-signage', 'category' => $businessSupport, 'name' => 'Printing & Signage', 'icon' => 'Printer',
                'short' => 'Storefront signage, lightboxes, and corporate print.',
                'desc' => 'Weatherproof outdoor signage, interior branding, and premium stationery printing matched to your corporate colors.',
                'benefits' => ['Weatherproof materials', 'Consistent brand colors', 'Interior and exterior options'],
                'faqs' => [],
            ],
        ];

        foreach ($services as $i => $s) {
            $service = Service::query()->updateOrCreate(
                ['slug' => $s['slug']],
                [
                    'solution_category_id' => $s['category']->id,
                    'name' => $s['name'],
                    'short_description' => $s['short'],
                    'description' => $s['desc'],
                    'icon' => $s['icon'],
                    'benefits' => $s['benefits'],
                    'is_featured' => $i < 4,
                    'sort_order' => $i + 1,
                ]
            );

            foreach ($s['faqs'] as $j => $faq) {
                $service->faqs()->updateOrCreate(
                    ['question' => $faq['q']],
                    ['answer' => $faq['a'], 'sort_order' => $j + 1],
                );
            }
        }

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

        CustomerProblem::query()->updateOrCreate(
            ['problem' => 'Manual attendance tracking and buddy punching'],
            [
                'solution_category_id' => $security->id,
                'target_user' => 'HR and operations teams',
                'impact' => 'Payroll leakage from inaccurate hours and time spent reconciling manual logs.',
                'solution_text' => 'Biometric attendance terminals with automated payroll export.',
                'sort_order' => 2,
            ]
        );

        CustomerProblem::query()->updateOrCreate(
            ['problem' => 'Slow, unreliable office network'],
            [
                'solution_category_id' => $tech->id,
                'target_user' => 'IT and operations managers',
                'impact' => 'Dropped connections and slow transfers disrupt daily work across the office.',
                'solution_text' => 'Structured cabling and network overhaul to Gigabit capability with an ongoing maintenance SLA.',
                'sort_order' => 3,
            ]
        );

        $courses = [
            ['slug' => 'cctv-surveillance-design-training', 'category' => $security,
                'title' => 'CCTV Surveillance Design & Biometric Integration',
                'level' => 'intermediate', 'mode' => 'face_to_face', 'duration' => '4 weeks',
                'desc' => 'Hands-on lab training covering camera placement, structured cabling, and NVR configuration.',
                'syllabus' => ['Lens optics & placement planning', 'Structured cabling essentials', 'NVR configuration', 'Biometric wiring'],
                'skills' => ['Camera network design', 'NVR administration', 'Access control wiring'],
                'price' => 350.00,
            ],
            ['slug' => 'enterprise-networking-security-foundations', 'category' => $tech,
                'title' => 'Enterprise Networking & Security Foundations',
                'level' => 'intermediate', 'mode' => 'face_to_face', 'duration' => '5 weeks',
                'desc' => 'Practical networking course covering IP topology, routing, VLANs, and perimeter security.',
                'syllabus' => ['Network standards & IP topology', 'Routing protocols & VLANs', 'Wireless optimization', 'Perimeter security & VPNs'],
                'skills' => ['Network topology design', 'VLAN segregation', 'VPN configuration'],
                'price' => 400.00,
            ],
            ['slug' => 'office-technology-business-automation', 'category' => $tech,
                'title' => 'Office Technology & Business Automation',
                'level' => 'beginner', 'mode' => 'online', 'duration' => '3 weeks',
                'desc' => 'Introductory course covering workplace hardware, cloud document syncing, and low-code automation.',
                'syllabus' => ['Workplace hardware orchestration', 'Cloud document syncing', 'Level 1 troubleshooting', 'Low-code automation tools'],
                'skills' => ['Basic hardware troubleshooting', 'Cloud file management', 'Simple workflow automation'],
                'price' => 150.00,
            ],
        ];

        foreach ($courses as $i => $c) {
            Course::query()->updateOrCreate(
                ['slug' => $c['slug']],
                [
                    'solution_category_id' => $c['category']->id,
                    'title' => $c['title'],
                    'duration' => $c['duration'],
                    'level' => $c['level'],
                    'mode' => $c['mode'],
                    'description' => $c['desc'],
                    'syllabus' => $c['syllabus'],
                    'skills_gained' => $c['skills'],
                    'price_amount' => $c['price'],
                    'price_currency' => 'ETB',
                    'sort_order' => $i + 1,
                ]
            );
        }

        $projects = [
            ['slug' => 'integrated-ip-surveillance-biometric-gates', 'category' => $security, 'client_type' => 'government',
                'title' => 'Integrated IP Surveillance & Biometric Gates Setup',
                'desc' => 'Full-site CCTV and biometric access control deployment across 8 external entry points.',
                'deliverables' => ['32-channel NVR stack', 'Biometric turnstiles at 8 entry points', 'Mobile monitoring app'],
                'results' => ['Digitized 100% of employee entry/exit timestamps'],
            ],
            ['slug' => 'corporate-lan-overhaul-preventive-support', 'category' => $tech, 'client_type' => 'private_enterprise',
                'title' => 'Corporate LAN Overhaul & Monthly Preventive Support SLA',
                'desc' => 'Structured cabling replacement and Gigabit network overhaul with an ongoing preventive maintenance contract.',
                'deliverables' => ['Structured Cat6 cabling', 'Gigabit switch rack', 'Monthly preventive maintenance SLA'],
                'results' => ['Eliminated recurring network dropouts', '100% operational uptime under the maintenance contract'],
            ],
            ['slug' => 'exterior-led-lightboxes-corporate-branding', 'category' => $businessSupport, 'client_type' => 'retail_hub',
                'title' => 'Exterior LED Lightboxes & Corporate Acrylic Branding Layout',
                'desc' => 'Storefront signage and interior branding package for a retail showroom relocation.',
                'deliverables' => ['Weatherproof LED lightboxes', 'Interior acrylic branding', 'Color-matched vinyl wraps'],
                'results' => ['Increased walk-in visitor traffic by approximately 35%'],
            ],
        ];

        foreach ($projects as $i => $p) {
            Project::query()->updateOrCreate(
                ['slug' => $p['slug']],
                [
                    'solution_category_id' => $p['category']->id,
                    'title' => $p['title'],
                    'client_type' => $p['client_type'],
                    'description' => $p['desc'],
                    'deliverables' => $p['deliverables'],
                    'results' => $p['results'],
                    'is_featured' => $i === 0,
                    'sort_order' => $i + 1,
                ]
            );
        }
    }
}
