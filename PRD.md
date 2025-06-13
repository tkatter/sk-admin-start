# Construction Company Admin Dashboard - Project Requirements

## Project Overview

**Company Type**: Construction (Carpentry Specialization)  
**Company Name**: SK Carpentry
**User Base**: 2 Admin Users  
**Purpose**: Comprehensive management dashboard for schedules, bids, resources, and job tracking

## Technology Stack

### Frontend

- **Framework**: React v19
- **Routing**: Tanstack Router
- **State Management & API**: Tanstack Query
- **Local State**: React Context API for UI state and sharing fetched data across components
- **Data Tables**: Tanstack Table
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS v4 + Shadcn UI Components
- **Authentication**: Better-Auth (email/password)
- **\*Real-time**: WebSocket integration for live collaboration updates\*
- **\*PWA**: Progressive Web App capabilities for offline access and device installation\*

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (hosted on Neon)
- **ORM**: Drizzle ORM
- **Authentication**: Better-Auth
- **\*Real-time**: WebSocket server for live updates\*
- **\*Notifications**: Email/SMS integration (Twilio) for automated reminders\*

## Core Features & Requirements

### 1. Authentication System

- **Login Method**: Email and password authentication
- **Access Control**: Restricted to 2 authorized admin users
- **Session Management**: Secure session handling with Better-Auth
- **Security**: Password hashing, secure token management

### 2. Schedule Management

#### 2.1 Calendar View

- **Display**: Visual calendar showing jobs, meetings, and events
- **Navigation**: Month/week/day views
- **Event Indicators**: Color-coded by type (jobs, meetings, events)
- **Interactions**: Click events to view details or edit
- **Upcoming Events**: Highlight upcoming jobs and meetings

#### 2.2 Schedule Table

**Columns Required**:

- Event Name
- Status (Pending, In Progress, Completed, Cancelled)
- Location (Job site address)
- Start Date & Time
- End Date & Time
- Notes/Description
- Actions (View Details, Edit, Delete)

**Functionality**:

- **CRUD Operations**: Create, Read, Update, Delete schedule items
- **Sorting**: All columns sortable
- **Filtering**: By status, date range, event type
- **Search**: Full-text search across all fields
- **Detail Page**: Click-through to full schedule item details
- **\*Conflict Detection**: Warning system for double-booked time slots or timeline conflicts\*
- **\*Optimistic Updates**: Immediate UI updates with automatic rollback on server errors\*

#### 2.3 Schedule Item Detail Page

- Complete event information
- File attachments related to the job
- Edit functionality with form validation
- Associated bid information (if applicable)
- Job progress notes and updates

### 3. Bid Management System

#### 3.1 Bid Overview Table

**Columns Required**:

- Bid Status (Draft, Submitted, Accepted, Rejected, In Review)
- Job Name
- Builder/Client Name
- Contact Information (Phone, Email)
- Job Location
- Project Start Date
- Project End Date
- Bid Amount (Auto-calculated total)
- Associated Files (Plans, Documents)
- Submitted Bid File (PDF)
- Actions (View, Edit, Delete, Download PDF)

#### 3.2 Bid Creation Form

**Form Fields**:

- Job Name
- Builder/Client Name
- Contact Information
- Job Location
- Estimated Start/End Dates
- Project Description/Notes
- File Upload (Building Plans, Documents)

**Form Implementation**:

- **React Hook Form**: Form state management and performance optimization
- **Zod Validation**: Type-safe schema validation for all form fields
- **Real-time Validation**: Instant feedback on field errors
- **Form Persistence**: Maintain form state during navigation

**Bid Items Section**:

- Template Selection Dropdown
- Dynamic Bid Item List:
  - Item Name (from template)
  - Quantity Input
  - Unit Price (from template)
  - Line Total (auto-calculated)
  - Notes/Description
- Live Calculation Display
- Add/Remove Bid Items
- Grand Total Calculation

#### 3.3 Bid Template System

**Template Management**:

- Create/Edit/Delete bid templates
- Template Name
- Bid Item Library:
  - Item Name (e.g., "Framing - Linear Foot", "Cabinet Installation - Each")
  - Unit Price
  - Unit Type (sq ft, linear ft, each, hour)
  - Category (Framing, Finishing, Installation, etc.)

**Template Application**:

- Select template when creating new bid
- Auto-populate available bid items
- Maintain pricing consistency across projects

#### 3.4 PDF Generation

- **Template**: Pre-designed PDF template for professional bid presentation
- **Content**: Company letterhead, bid items table, totals, terms
- **Generation**: Server-side PDF creation upon bid submission
- **Download**: Immediate download capability for users
- **Storage**: PDF stored in database and file system
- **\*Bid Comparison**: Side-by-side comparison view for multiple bids\*

### 4. Company Resources Management

#### 4.1 Contacts Management

- **Contact Types**: Clients, Suppliers, Subcontractors, Vendors
- **Information**: Name, Company, Phone, Email, Address, Notes
- **Categories**: Filterable by contact type
- **Search**: Full-text search across all contact fields

#### 4.2 To-Do Items

- **Task Management**: Create, assign, complete tasks
- **Priority Levels**: High, Medium, Low
- **Due Dates**: Date tracking and overdue indicators
- **Categories**: General, Job-specific, Administrative
- **Notes**: Detailed task descriptions

#### 4.3 Financial Tracking

- **Income Tracking**: Completed job payments
- **Expense Tracking**: Materials, labor, overhead
- **Job Profitability**: Revenue vs. costs per job
- **Monthly/Annual Summaries**: Financial reporting
- **Budget Planning**: Estimated vs. actual costs

### 5. File Management System

- **File Upload**: Support for common formats (PDF, DOC, XLS, images)
- **File Association**: Link files to specific jobs, bids, or schedule items
- **File Organization**: Categorized by job, type, date
- **Preview**: In-browser preview for supported file types
- **Download**: Direct download functionality
- **Storage**: Secure cloud storage with backup

### 6. Daily Tasks & Job Notes

#### 6.1 Job-Specific Notes

- **Daily Logs**: Progress updates, issues, materials used
- **Photo Uploads**: Job site photos with timestamp
- **Time Tracking**: Hours worked per job
- **Weather Conditions**: Impact on outdoor work
- **Quality Control**: Inspection notes and approvals

#### 6.2 Task Management

- **Daily Task Lists**: What needs to be accomplished
- **Task Assignment**: Assign tasks to specific jobs or general company needs
- **Progress Tracking**: Mark tasks as started, in-progress, completed
- **Recurring Tasks**: Weekly/monthly recurring maintenance tasks

## Database Schema Requirements

### Tables Needed

1. **users** - Admin user accounts
2. **schedule_events** - Calendar and schedule items
3. **bids** - Bid information and status
4. **bid_items** - Individual line items within bids
5. **bid_templates** - Reusable pricing templates
6. **template_items** - Items within templates
7. **contacts** - Company contact database
8. **todos** - Task management
9. **financial_records** - Income and expense tracking
10. **files** - File metadata and associations
11. **job_notes** - Daily notes and updates
12. **tasks** - Daily and job-specific tasks
13. **\*analytics_data** - Performance metrics and KPI tracking\*
14. **\*user_sessions** - WebSocket session management\*
15. **\*notifications** - System notifications and reminders\*
16. **\*saved_filters** - User-defined search and filter presets\*

## User Interface Requirements

### Design Standards

- **Responsive Design**: Desktop-first, mobile-friendly
- **Color Scheme**: Monochromatic dark mode theme with strategic accent colors for UI interactions and visual effects
- **Typography**: Clear, readable fonts suitable for data-heavy interfaces
- **Icons**: Consistent icon library (Lucide React recommended)
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: User-friendly error messages and validation with toast notifications for errors and success confirmations
- **\*Keyboard Shortcuts**: Quick actions for common operations (Ctrl+N for new, Ctrl+S for save)\*
- **\*Mobile Optimization**: Enhanced mobile experience for schedule/calendar views\*
- **\*Real-time Indicators**: Visual indicators when other users are editing shared content\*

### Navigation Structure

- **Dashboard Home**: Summary cards and recent activity
- **Schedule**: Calendar and table views
- **Bids**: Bid management and templates
- **Resources**: Contacts, todos, finances
- **Files**: File management system
- **Settings**: User preferences and system configuration
- **\*Analytics**: Basic reporting and performance metrics dashboard\*
- **\*Global Search**: Advanced search across all entities with saved filter presets\*

## Performance Requirements

- **Load Time**: Initial page load under 3 seconds
- **Data Loading**: Table data loads under 2 seconds
- **File Upload**: Support files up to 50MB
- **Real-time Updates**: UI updates immediately after database changes
- **\*Offline Capability**: Basic read-only functionality when offline via PWA\*
- **\*WebSocket Performance**: Real-time updates with <100ms latency\*
- **\*Optimistic Updates**: Immediate UI feedback with <50ms response time\*

## Security Requirements

- **Authentication**: Secure login with session management
- **Authorization**: Role-based access (admin-only for all features)
- **Data Encryption**: Sensitive data encrypted at rest and in transit
- **File Security**: Secure file upload with virus scanning
- **Backup**: Automated daily database backups
- **Audit Trail**: Log all CRUD operations with user attribution

## Enhanced Features (\*Requires Further Review)

### Dashboard Home Enhancements

- **\*Customizable Widgets**: KPI widgets showing monthly revenue, upcoming deadlines, overdue tasks, bid win rate\*
- **\*Quick Action Buttons**: Frequently used actions accessible from dashboard\*
- **\*Recent Activity Feed**: Real-time feed of recent changes and updates\*

### Advanced Search & Filtering

- **\*Global Search**: Search across all entities (schedules, bids, contacts, files) from a single search bar\*
- **\*Saved Filter Presets**: Pre-configured filters like "Active Jobs This Month", "Pending Bids Over $10k"\*
- **\*Smart Suggestions**: Auto-complete and suggested searches based on user patterns\*

### Real-time Collaboration Features

- **\*Live Editing Indicators**: Show when another user is currently editing a record\*
- **\*Conflict Prevention**: Lock records being edited to prevent simultaneous changes\*
- **\*Activity Notifications**: Real-time notifications of changes made by other users\*

### Automated Communication

- **\*Email Reminders**: Automated emails for upcoming deadlines and bid submissions\*
- **\*SMS Notifications**: Text message alerts for urgent items (requires Twilio integration)\*
- **\*Calendar Integration**: Export schedules to external calendar applications (iCal format)\*

### Performance Optimization

- **\*Optimistic Updates**: Immediate UI feedback with automatic rollback on errors\*
- **\*Offline Capabilities**: PWA features for basic read-only access without internet\*
- **\*Background Sync**: Sync changes when connection is restored\*

### Analytics & Reporting

- **\*Bid Performance Analytics**: Win rate tracking, average bid values, conversion metrics\*
- **\*Financial Dashboard**: Revenue trends, profitability analysis, expense tracking\*
- **\*Job Duration Analysis**: Track actual vs. estimated project timelines\*
- **\*Export Capabilities**: Export data to Excel/CSV formats for external analysis\*

### Mobile Enhancements

- **\*Touch-Optimized Calendar**: Gesture support for mobile calendar navigation\*
- **\*Quick Actions**: Swipe gestures for common actions on mobile\*
- **\*Offline Schedule Access**: View schedules without internet connection\*

### Advanced File Management

- **\*File Versioning**: Track changes to uploaded documents and plans\*
- **\*Bulk Upload**: Upload multiple files simultaneously\*
- **\*File Preview**: In-browser preview for images, PDFs, and documents\*
- **\*File Organization**: Automatic categorization and tagging\*

## Integration Requirements

- **\*Email Notifications**: Automated emails for bid submissions and deadlines\*
- **\*Calendar Export**: Export schedule to external calendar applications\*
- **\*Data Export**: Export tables to CSV/Excel format\*
- **\*Backup/Restore**: Database backup and restoration capabilities\*
- **\*Third-party Calendar Sync**: Integration with Google Calendar, Outlook\*
- **\*SMS Integration**: Twilio for text message notifications\*

## Development Phases

### Phase 1: Foundation (Weeks 1-2)

- Project setup and configuration
- Authentication system implementation
- Basic UI layout and navigation
- Database schema creation

### Phase 2: Core Features (Weeks 3-6)

- Schedule management (calendar and table)
- Basic bid management
- File upload system
- Company resources (contacts, todos)

### Phase 3: Advanced Features (Weeks 7-9)

- Bid template system
- PDF generation
- Advanced filtering and search
- Financial tracking
- _\*\*Analytics dashboard and KPI widgets_
- _\*\*Real-time collaboration features_

### Phase 4: Polish & Testing (Weeks 10-12)

- UI/UX refinements
- Performance optimization
- Comprehensive testing
- Documentation and deployment
- _\*\*PWA implementation and offline capabilities_
- _\*\*Automated notification system setup_

## Success Criteria

- **Functionality**: All specified features working correctly
- **Usability**: Intuitive interface requiring minimal training
- **Performance**: Fast loading and responsive interactions
- **Reliability**: 99.9% uptime with automatic error recovery
- **Security**: No security vulnerabilities in penetration testing
- **User Satisfaction**: Positive feedback from both admin users

## Post-Launch Support

- **Bug Fixes**: Immediate resolution of critical issues
- **Feature Requests**: Evaluation and implementation of new features
- **Maintenance**: Regular updates and security patches
- **Training**: User training sessions and documentation
- **Backup Management**: Regular backup verification and restoration testing
