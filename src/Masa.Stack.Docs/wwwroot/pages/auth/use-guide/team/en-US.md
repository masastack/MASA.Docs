# Team Introduction

Team management includes operations such as adding, editing, and deleting teams.

1. Log in to the Auth Console using an Auth user account.
2. Click on "Project Teams" in the left navigation bar.

## Team Search

The team list is displayed in card format and currently does not have pagination. The team card includes team avatar, number of members, team name, team administrator, and edit time. The search box in the upper right corner can be used to search for teams by name, and pressing Enter triggers the search action.

![Project Team Image](https://cdn.masastack.com/stack/doc/auth/use-guide/team/teams.png)

## Creating a New Team

Click the "New" button in the upper right corner of the card list to bring up the new team window.

Creating a new team is a step-by-step process that includes team basic information, team administrator, and team members.

> Only employees can join a team.

### 1. Basic Information

Enter the team name and activate the "Next" button. The team avatar is generated based on the first character of the team name and the selected color.

   * **Team Name**: Required
   * **Avatar Text**: Optional. The text displayed in the avatar, defaults to the first character of the team name.
   * **Avatar Color**: Required. The background color of the avatar.
   * **Type**: Required. The type of team.
   * **Description**: Optional. A description of the team.

   ![New Team Step 1 - Basic Information Image](https://cdn.masastack.com/stack/doc/auth/use-guide/team/team-add-basic.png)

### 2. Team Administrator

   From top to bottom, select the team administrator, set the team administrator role, and set the team administrator permissions.

   > The role list lists all available roles. Since roles can limit the number of people bound to them, the role will be disabled when the number of administrators exceeds the number of people that can be bound to the role.

   The application permission tree is at the bottom and the application data is obtained from PM. The permission tree can be used to disable permissions inherited from roles or add additional permissions.

   ![New Team Step 2 - Set Administrator Image](https://cdn.masastack.com/stack/doc/auth/u### 3. Team Members

Same as `Team Admins`.

> When selecting team members, employees who have been set as team admins are automatically filtered out.

![Step 3: Add Team Members](https://cdn.masastack.com/stack/doc/auth/use-guide/team/team-add-member.png)

## Edit Team

Click on the `Edit Icon` in the upper right corner of the team card you want to edit to bring up the edit team window. Here you can edit team information and delete the team.

![Edit Team Icon](https://cdn.masastack.com/stack/doc/auth/use-guide/team/team-edit-icon.png)

### Basic Information

![Edit Team Basic Information](https://cdn.masastack.com/stack/doc/auth/use-guide/team/team-edit-basic.png)

### Team Admins

Click to set admins.

![Edit Team Admins](https://cdn.masastack.com/stack/doc/auth/use-guide/team/team-edit-admin.png)

### Team Members

Click to set team members.

![Edit Team Members](https://cdn.masastack.com/stack/doc/auth/use-guide/team/team-edit-member.png)

### Delete Members

Click the `Delete` button in the lower left corner of the edit team window to bring up the confirmation dialog. Click `OK` to delete the team.

![Delete Team](https://cdn.masastack.com/stack/doc/auth/use-guide/team/team-delete.png)