/**
 * Mock data for development — sẽ thay bằng API call khi Backend sẵn sàng
 */
import { TaskDetail, Task } from '../types/types';

// =============================================================================
// Mock Task Details (đầy đủ thông tin cho TaskDetailScreen)
// =============================================================================
export const MOCK_TASK_DETAILS: TaskDetail[] = [
  {
    id: '1',
    title: 'System Architecture Audit',
    dueDate: 'Oct 24, 2023',
    assignee: 'Alex Chen',
    description:
      'Perform security and scalability audit of legacy cloud infrastructure. Document bottlenecks in the primary database cluster and provide mitigation strategies.',
    status: 'IN_PROGRESS',
    technicalBriefs: [
      {
        id: 'tb1',
        name: 'INFRA_SPECS_V2.PDF',
        type: 'pdf',
        url: 'https://example.com/docs/infra_specs_v2.pdf',
      },
      {
        id: 'tb2',
        name: 'NETWORK_TOPOLOGY.PNG',
        type: 'png',
        url: 'https://example.com/docs/network_topology.png',
      },
    ],
  },
  {
    id: '2',
    title: 'Core API Infrastructure',
    dueDate: 'Apr 02, 2026',
    assignee: 'Sarah Chen',
    description:
      'Design and implement RESTful API endpoints for the intern management module. Include authentication middleware, rate limiting, and comprehensive error handling. Document all endpoints with OpenAPI specification.',
    status: 'IN_REVIEW',
    technicalBriefs: [
      {
        id: 'tb3',
        name: 'API_DESIGN_DOC.PDF',
        type: 'pdf',
        url: 'https://example.com/docs/api_design.pdf',
      },
    ],
    submittedReport: 'Completed all 12 API endpoints with full test coverage. Rate limiting configured at 100 req/min per user.',
  },
  {
    id: '3',
    title: 'Mobile Wireframe Prototyping',
    dueDate: 'Mar 28, 2026',
    assignee: 'Alex Rivera',
    description:
      'Create high-fidelity wireframes for the mobile intern dashboard. Include task management flow, report submission screens, and notification center. Use Figma for collaborative design.',
    status: 'NEEDS_REVISION',
    technicalBriefs: [
      {
        id: 'tb4',
        name: 'UI_GUIDELINES_V3.PDF',
        type: 'pdf',
        url: 'https://example.com/docs/ui_guidelines.pdf',
      },
      {
        id: 'tb5',
        name: 'BRAND_ASSETS.ZIP',
        type: 'other',
        url: 'https://example.com/docs/brand_assets.zip',
      },
    ],
    feedback: {
      content:
        'The wireframes look good overall, but please revise the navigation flow for the task detail screen. The back button should return to the workspace, not the profile. Also, add a loading state for the submit action.',
      date: 'Mar 25, 2026',
    },
    submittedReport: 'Initial wireframe submission with 8 screens covering main user flows.',
  },
  {
    id: '4',
    title: 'Design System Documentation',
    dueDate: 'Mar 25, 2026',
    assignee: 'John Doe',
    description:
      'Document the complete design system including color palette, typography scale, spacing system, and component library. Create a living style guide that auto-updates with code changes.',
    status: 'DONE',
    technicalBriefs: [
      {
        id: 'tb6',
        name: 'STYLE_GUIDE_TEMPLATE.PDF',
        type: 'pdf',
        url: 'https://example.com/docs/style_guide.pdf',
      },
    ],
    submittedReport: 'Complete design system documentation with 45 components cataloged.',
  },
  {
    id: '5',
    title: 'Database Migration Script',
    dueDate: 'Mar 15, 2026',
    assignee: 'Emily Park',
    description:
      'Write migration scripts to upgrade the PostgreSQL schema from v2 to v3. Include rollback procedures and data validation steps. Test with production-like dataset.',
    status: 'OVERDUE',
    technicalBriefs: [
      {
        id: 'tb7',
        name: 'DB_SCHEMA_V3.SQL',
        type: 'doc',
        url: 'https://example.com/docs/schema_v3.sql',
      },
      {
        id: 'tb8',
        name: 'MIGRATION_GUIDE.PDF',
        type: 'pdf',
        url: 'https://example.com/docs/migration_guide.pdf',
      },
    ],
  },
];

// =============================================================================
// Mock Task List (dữ liệu rút gọn cho TaskListScreen)
// =============================================================================
export const MOCK_TASKS: Task[] = MOCK_TASK_DETAILS.map((t) => ({
  id: t.id,
  title: t.title,
  mentor: t.assignee,
  date: t.dueDate,
  status: t.status,
}));
