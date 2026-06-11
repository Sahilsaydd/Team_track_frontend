import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CreateGroupModel } from '../../../core/model/create-group-model';
import { Group } from '../../../core/services/group';
import { User, AppUser } from '../../../core/services/user';

type EmployeeOption = Pick<AppUser, 'id' | 'username' | 'email' | 'is_active'>;

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-group.html',
  styleUrl: './create-group.css',
})
export class CreateGroup implements OnInit {
  employees: EmployeeOption[] = [];
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  previewHtml = '';
  employeeSearchTerm = '';

  groupData: CreateGroupModel = {
    name: '',
    description: '',
    profile_pic: null,
    members: [],
  };

  selectedEmployeeid = 0;
  selectedRole = 'Member';
  note = '';

  constructor(
    private userServices: User,
    private groupServices: Group,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userServices.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = (data ?? [])
          .filter((employee) => employee.is_active)
          .map((employee) => ({
            id: employee.id,
            username: employee.username,
            email: employee.email,
            is_active: employee.is_active,
          }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load active employees for the group builder.';
        this.cdr.detectChanges();
      },
    });
  }

  get filteredEmployees(): EmployeeOption[] {
    const term = this.employeeSearchTerm.trim().toLowerCase();
    return this.employees.filter((employee) => {
      if (!term) {
        return true;
      }

      return (
        employee.username?.toLowerCase().includes(term) ||
        employee.email?.toLowerCase().includes(term) ||
        String(employee.id).includes(term)
      );
    });
  }

  get selectedEmployee(): EmployeeOption | undefined {
    return this.employees.find((employee) => employee.id === Number(this.selectedEmployeeid));
  }

  getEmployeeById(userId: number): EmployeeOption | undefined {
    return this.employees.find((employee) => employee.id === userId);
  }

  getEmployeeName(userId: number): string {
    return this.getEmployeeById(userId)?.username || `Employee ${userId}`;
  }

  getEmployeeEmail(userId: number): string {
    return this.getEmployeeById(userId)?.email || '';
  }

  get leaderCount(): number {
    return this.groupData.members.filter((member) => member.role_in_group === 'Lead').length;
  }

  get canAddMember(): boolean {
    return !!this.selectedEmployeeid && !!this.selectedRole && !this.isSelectedEmployeeAlreadyAdded();
  }

  isSelectedEmployeeAlreadyAdded(): boolean {
    return this.groupData.members.some((member) => member.user_id === Number(this.selectedEmployeeid));
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.groupData.profile_pic = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  addMember(): void {
    if (!this.selectedEmployeeid) {
      this.errorMessage = 'Please select an employee first.';
      return;
    }

    if (this.isSelectedEmployeeAlreadyAdded()) {
      this.errorMessage = 'This employee is already added to the group.';
      return;
    }

    if (this.selectedRole === 'Lead' && this.groupData.members.some((m) => m.role_in_group === 'Lead')) {
      this.errorMessage = 'Only one leader is allowed in a group.';
      return;
    }

    this.errorMessage = '';
    this.groupData.members.push({
      user_id: Number(this.selectedEmployeeid),
      role_in_group: this.selectedRole,
      note: this.note.trim() || undefined,
    });

    this.selectedEmployeeid = 0;
    this.selectedRole = 'Member';
    this.note = '';
    this.employeeSearchTerm = '';
    this.cdr.detectChanges();
  }

  removeMember(index: number): void {
    this.groupData.members.splice(index, 1);
    this.cdr.detectChanges();
  }

  resetMembers(): void {
    this.groupData.members = [];
    this.cdr.detectChanges();
  }

  openConfirmDialog(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.groupData.members.length) {
      this.errorMessage = 'Add at least one member before creating the group.';
      this.cdr.detectChanges();
      return;
    }

    const membersMarkup = this.groupData.members
      .map((member, index) => {
        const employee = this.employees.find((item) => item.id === member.user_id);
        return `
          <div class="swal-group-member">
            <span class="swal-member-index">${index + 1}</span>
            <div>
              <strong>${employee?.username || `Employee #${member.user_id}`}</strong>
              <div class="swal-member-meta">${member.role_in_group}${member.note ? ` • ${member.note}` : ''}</div>
            </div>
          </div>
        `;
      })
      .join('');

    const imagePreview = this.groupData.profile_pic
      ? `<img src="${this.groupData.profile_pic}" alt="Group preview" class="swal-image-preview" />`
      : `<div class="swal-image-placeholder"><i class="fa-solid fa-image"></i></div>`;

    this.previewHtml = `
      <div class="swal-group-summary">
        <div class="swal-summary-grid">
          <div>
            <span class="swal-label">Group name</span>
            <strong>${this.escapeHtml(this.groupData.name)}</strong>
          </div>
          <div>
            <span class="swal-label">Members</span>
            <strong>${this.groupData.members.length}</strong>
          </div>
          <div>
            <span class="swal-label">Leader</span>
            <strong>${this.leaderCount || 0}</strong>
          </div>
        </div>
        ${imagePreview}
        <p class="swal-description">${this.escapeHtml(this.groupData.description || 'No description added yet.')}</p>
        <div class="swal-member-list">${membersMarkup}</div>
      </div>
    `;

    Swal.fire({
      title: 'Review group details',
      html: this.previewHtml,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Create group',
      cancelButtonText: 'Go back',
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#e2e8f0',
      width: 720,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.createGroup(form);
      }
    });
  }

  createGroup(form: NgForm): void {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.groupServices.createGroup(this.groupData).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Group created successfully.';
        this.cdr.detectChanges();

        Swal.fire({
          title: 'Group created',
          text: `${this.groupData.name} has been created successfully.`,
          icon: 'success',
          confirmButtonText: 'View groups',
          confirmButtonColor: '#198754',
        }).then(() => {
          this.router.navigate(['/groups']);
        });

        form.resetForm();
        this.groupData = {
          name: '',
          description: '',
          profile_pic: null,
          members: [],
        };
        this.selectedEmployeeid = 0;
        this.selectedRole = 'Member';
        this.note = '';
        this.employeeSearchTerm = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.detail || 'Unable to create the group right now.';
        this.cdr.detectChanges();
      },
    });
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
