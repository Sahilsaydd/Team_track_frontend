import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Group } from '../../../core/services/group';

type GroupMember = {
  user_id?: number;
  role_in_group?: string;
  // Some API responses use different property names for role
  role?: string;
  roleName?: string;
};

type GroupCard = {
  id?: number;
  name?: string;
  description?: string;
  group_code?: string;
  profile_pic?: string | null;
  is_active?: boolean;
  created_at?: string;
  members?: GroupMember[];
};

@Component({
  selector: 'app-get-all-groups',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './get-all-groups.html',
  styleUrl: './get-all-groups.css',
})
export class GetAllGroups implements OnInit {
  groups: GroupCard[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';
  statusFilter: 'All' | 'Active' | 'Inactive' = 'All';
  private readonly apiBaseUrl = 'http://localhost:8000';

  constructor(
    private groupService: Group,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.all_groups();
  }

  all_groups(): void {
    this.loading = true;
    this.errorMessage = '';

    this.groupService.getAllGroups().subscribe({
      next: (data) => {
        this.groups = (data ?? []).map((group: any) => ({
          id: group.id,
          name: group.name,
          description: group.description,
          group_code: group.group_code,
          profile_pic: group.profile_pic,
          is_active: group.is_active ?? true,
          created_at: group.created_at,
          // Support multiple possible API shapes for members
          members:
            (Array.isArray(group.members) && group.members.length
              ? group.members
              : Array.isArray(group.group_members) && group.group_members.length
              ? group.group_members
              : Array.isArray(group.users) && group.users.length
              ? group.users
              : []
            ).map((m: any) => ({
              user_id: m.user_id ?? m.id,
              role_in_group: m.role_in_group ?? m.role ?? m.roleName ?? m.role_name ?? m.position ?? '',
              role: m.role ?? m.role_in_group ?? m.roleName ?? undefined,
              roleName: m.roleName ?? m.role ?? m.role_in_group ?? undefined,
            })),
        }));
        this.loading = false;
        // After mapping groups, fetch members for each group to ensure accurate counts
        this.groups.forEach((g) => {
          if (g.id !== undefined) {
            this.groupService.get_group_members(Number(g.id)).subscribe({
              next: (membersData: any) => {
                const raw = Array.isArray(membersData) ? membersData : membersData?.members ?? [];
                g.members = raw.map((m: any) => ({
                  user_id: m.user_id ?? m.id,
                  role_in_group: m.role_in_group ?? m.role ?? m.roleName ?? m.role_name ?? m.position ?? '',
                  role: m.role ?? m.role_in_group ?? m.roleName ?? undefined,
                  roleName: m.roleName ?? m.role ?? m.role_in_group ?? undefined,
                }));
                this.cdr.detectChanges();
              },
              error: () => {
                // leave members as-is (mapped value) on error
              }
            });
          }
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load groups right now. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }

  get filteredGroups(): GroupCard[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.groups.filter((group) => {
      const matchesSearch =
        !term ||
        group.name?.toLowerCase().includes(term) ||
        group.group_code?.toLowerCase().includes(term) ||
        group.description?.toLowerCase().includes(term);

      const isActive = group.is_active !== false;
      const matchesStatus =
        this.statusFilter === 'All' ||
        (this.statusFilter === 'Active' && isActive) ||
        (this.statusFilter === 'Inactive' && !isActive);

      return matchesSearch && matchesStatus;
    });
  }

  get totalGroups(): number {
    return this.groups.length;
  }

  get activeGroups(): number {
    return this.groups.filter((group) => group.is_active !== false).length;
  }

  get inactiveGroups(): number {
    return this.groups.filter((group) => group.is_active === false).length;
  }

  get totalMembers(): number {
    return this.groups.reduce((sum, group) => sum + (group.members?.length ?? 0), 0);
  }

  get totalLeaders(): number {
    return this.groups.reduce((sum, group) => {
      const leaders = group.members?.filter((member) => {
        const role = (member.role_in_group || member.role || member.roleName || '').toString().toLowerCase();
        return role.includes('lead');
      }).length ?? 0;
      return sum + leaders;
    }, 0);
  }

  trackByGroupId(index: number, group: GroupCard): number {
    return group.id ?? index;
  }

  getStatusLabel(group: GroupCard): string {
    return group.is_active === false ? 'Inactive' : 'Active';
  }

  getCreatedAtLabel(value?: string): string {
    if (!value) {
      return 'Unknown date';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  getLeaderCount(group: GroupCard): number {
    return group.members?.filter((member) => {
      const role = (member.role_in_group || member.role || member.roleName || '').toString().toLowerCase();
      return role.includes('lead');
    }).length ?? 0;
  }

  getMemberCount(group: GroupCard): number {
    return group.members?.length ?? 0;
  }

  getGroupImageUrl(group: GroupCard): string | null {
    const image = group.profile_pic?.trim();

    if (!image) {
      return null;
    }

    if (/^(https?:|data:|blob:)/i.test(image)) {
      return image;
    }

    if (image.startsWith('/')) {
      return `${this.apiBaseUrl}${image}`;
    }

    return `${this.apiBaseUrl}/${image}`;
  }

  openGroup(group: GroupCard): void {
    this.router.navigate(['/groups/create'], { state: { group } });
  }

  editGroup(group:GroupCard):void{
    this.router.navigate(['/groups/update',group.id])
  }

  viewMembers(group: GroupCard): void {
    this.router.navigate(['/groups/create'], { state: { group, mode: 'members' } });
  }

  redirectToGroupDetails(id: number): void {

    this.router.navigate(['/groups/', id]);
  }

}
