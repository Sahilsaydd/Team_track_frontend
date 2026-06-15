import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { Group } from '../../../core/services/group';

@Component({
  selector: 'app-update-group',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './update-group.html',
  styleUrls: ['./update-group.css']
})
export class UpdateGroup implements OnInit {

  updateForm: FormGroup;

  groupId!: number;

  loading = false;

  imagePreview = '';

  selectedImageBase64 = '';

  constructor(
    private fb: FormBuilder,
    private groupService: Group,
    public router: Router,
    private route: ActivatedRoute
  ) {

    this.updateForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(500)
        ]
      ],

      profile_pic: [''],

      is_active: [true],

      group_code: [
        {
          value: '',
          disabled: true
        }
      ],

      created_at: [
        {
          value: '',
          disabled: true
        }
      ]
    });
  }

  ngOnInit(): void {

    this.groupId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (this.groupId) {
      this.loadGroup();
    }
  }

  loadGroup(): void {

    this.loading = true;

    this.groupService
      .get_group_by_id(this.groupId)
      .subscribe({

        next: (res: any) => {

          this.updateForm.patchValue({

            name: res.name,

            description: res.description,

            is_active: res.is_active,

            group_code: res.group_code,

            created_at: new Date(
              res.created_at
            ).toLocaleDateString()

          });

          if (res.profile_pic) {

            this.imagePreview =
              `http://localhost:8000/${res.profile_pic}`;

          }

          this.loading = false;
        },

        error: () => {

          this.loading = false;

          Swal.fire(
            'Error',
            'Failed to load group details',
            'error'
          );
        }
      });
  }

  onFileSelected(event: any): void {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

      this.selectedImageBase64 =
        reader.result as string;

      this.imagePreview =
        this.selectedImageBase64;
    };

    reader.readAsDataURL(file);
  }

  submit(): void {

    if (this.updateForm.invalid) {

      this.updateForm.markAllAsTouched();

      return;
    }

    Swal.fire({
      title: 'Update Group?',
      text: 'Do you want to save the changes?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Update'
    }).then((result) => {

      if (result.isConfirmed) {
        this.updateGroup();
      }
    });
  }

  updateGroup(): void {

    this.loading = true;

    const payload = {

      name: this.updateForm.value.name,

      description:
        this.updateForm.value.description,

      is_active:
        this.updateForm.value.is_active,

      profile_pic:
        this.selectedImageBase64 || null
    };

    this.groupService
      .updategroup_services(
        this.groupId,
        payload
      )
      .subscribe({

        next: () => {

          this.loading = false;

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Group updated successfully'
          }).then(() => {

            this.router.navigate([
              '/groups'
            ]);

          });
        },

        error: (err) => {

          this.loading = false;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              err?.error?.detail ||
              'Failed to update group'
          });
        }
      });
  }

  get name() {
    return this.updateForm.get('name');
  }

  get description() {
    return this.updateForm.get('description');
  }
}
