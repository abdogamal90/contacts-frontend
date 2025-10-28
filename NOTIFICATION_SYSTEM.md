# Notification System

## Overview
A centralized, reusable notification system that provides toast-style notifications across the application. This replaces all scattered `alert()` calls and manual error message handling with a consistent, user-friendly notification experience.

## Architecture

### NotificationService (`src/app/services/notification.service.ts`)
- **Purpose**: Central service for managing notifications
- **Pattern**: Observable-based using RxJS Subject
- **Location**: Injectable service available application-wide

### NotificationComponent (`src/app/components/notification/`)
- **Purpose**: Visual display of notifications
- **Location**: Rendered globally in `app.component.html`
- **Position**: Fixed top-right corner
- **Behavior**: Auto-dismiss with configurable durations

## Notification Types

| Type | Color | Duration | Icon | Use Case |
|------|-------|----------|------|----------|
| Success | Green Gradient | 3 seconds | ✓ Checkmark | Successful operations |
| Error | Red Gradient | 5 seconds | ✕ X Mark | Failed operations |
| Warning | Orange Gradient | 4 seconds | ⚠ Warning | Validation errors |
| Info | Blue Gradient | 3 seconds | ℹ Info | Informational messages |

## Usage

### Basic Usage
```typescript
import { NotificationService } from '../services/notification.service';

constructor(private notification: NotificationService) {}

// Success notification
this.notification.success('Operation completed successfully!');

// Error notification
this.notification.error('Something went wrong!');

// Warning notification
this.notification.warning('Please check your input');

// Info notification
this.notification.info('Here's some helpful information');
```

### Error Handling
The service includes a smart `handleError()` method that parses backend errors:

```typescript
this.contactsService.createContact(data).subscribe(
  (response) => {
    this.notification.success('Contact created!');
  },
  (error) => {
    // Automatically parses error.error.errors[], error.error.message, etc.
    this.notification.handleError(error, 'Failed to create contact');
  }
);
```

### Error Format Support
The `handleError()` method intelligently handles multiple backend error formats:
- Array of errors: `error.error.errors[]` → Joins all error messages
- Single error: `error.error.error` → Displays single message
- Message property: `error.error.message` → Displays message
- Fallback: Uses provided default message

## Features

### Auto-Dismiss
- Notifications automatically disappear after their configured duration
- Different durations based on notification type (errors stay longer)
- Users can manually dismiss by clicking the close button

### Animations
- **slideIn**: Smooth entrance animation from right
- **shake**: Error fields shake to draw attention
- **pulse**: Icon animations for visual feedback

### Responsive Design
- Adapts to mobile screens (full width on small devices)
- Touch-friendly close buttons
- Proper z-index layering

### Multiple Notifications
- Stacks multiple notifications vertically
- Each notification manages its own timer
- Maintains unique IDs to prevent duplicates

## Integration Points

### Currently Integrated In:
✅ **Login Component** - Login success/failure messages
✅ **Profile Component** - Username/password updates, load errors
✅ **Contacts Component** - Inline edit, delete operations, locking warnings
✅ **New Contact Component** - Creation success/errors, validation warnings
✅ **Edit Contact Component** - Update success/errors, validation warnings

### Replaced Functionality:
- ❌ All `alert()` calls
- ❌ Manual `errorMessage` / `message` properties
- ❌ Local error display components
- ❌ setTimeout cleanup logic
- ❌ Duplicate error parsing code

## Styling

### Color Scheme
Matches the application's purple gradient theme:
- Success: `#10b981` to `#059669` (green gradient)
- Error: `#ef4444` to `#dc2626` (red gradient)
- Warning: `#f59e0b` to `#d97706` (orange gradient)
- Info: `#3b82f6` to `#2563eb` (blue gradient)

### CSS Classes
- `.notification-container` - Fixed positioning container
- `.notification` - Individual notification card
- `.notification-{type}` - Type-specific styling
- `.notification-icon` - SVG icon container
- `.notification-close` - Close button

## Benefits

1. **Consistency**: All notifications look and behave the same
2. **Maintainability**: One place to update notification behavior
3. **User Experience**: Non-intrusive, auto-dismissing toasts
4. **Error Handling**: Smart parsing of various backend error formats
5. **Accessibility**: Clear visual feedback with icons and colors
6. **Flexibility**: Easy to add new notification types or customize behavior

## Future Enhancements
- [ ] Add sound notifications (optional)
- [ ] Persist critical notifications until user interaction
- [ ] Add notification history/log
- [ ] Support for action buttons in notifications
- [ ] Keyboard shortcuts for dismissing notifications
- [ ] Group similar notifications
- [ ] Progress indicators for long operations
