import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { DashboardResponse } from '../../../core/model/dashboard';
import { DashboardService } from '../../../core/services/dashboard';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {

  dashboard!: DashboardResponse;
  today: Date = new Date();
  loading = true;
  private taskStatusChart: Chart | null = null;
  private roleDistributionChart: Chart | null = null;
  private topEmployeesChart: Chart | null = null;

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.loadDashboard()
  }


  loadDashboard() {
    this.loading = true
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data
        this.loading = false
        console.log('dashboard data', this.dashboard)
        this.cdr.detectChanges()
        this.renderTaskStatusChart();
        this.renderRoleDistributionChart();
        this.renderTopEmployeesChart();

      },
      error: (err) => {
        console.error(err)
        this.loading = false
      }
    })
  }

  private renderTaskStatusChart(): void {
    if (!this.dashboard?.task_status) {
      return;
    }

    const canvas = document.getElementById('taskStatusChart') as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    if (this.taskStatusChart) {
      this.taskStatusChart.destroy();
    }

    const labels = ['Todo', 'In Progress', 'Submitted', 'Completed', 'Needs Revision'];
    const values = [
      this.dashboard.task_status.todo ?? 0,
      this.dashboard.task_status.in_progress ?? 0,
      this.dashboard.task_status.submitted ?? 0,
      this.dashboard.task_status.completed ?? 0,
      this.dashboard.task_status.needs_revision ?? 0,
    ];

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            label: 'Task Status',
            data: values,
            backgroundColor: [
              '#6c757d',
              '#0d6efd',
              '#ffc107',
              '#198754',
              '#dc3545',
            ],
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = Number(context.raw) || 0;
                return `${label}: ${value}`;
              },
            },
          },
        },
      },
    };

    this.taskStatusChart = new Chart(canvas, config);
  }

  private renderRoleDistributionChart(): void {
    if (!this.dashboard?.role_distribution) {
      return;
    }

    const canvas = document.getElementById('roleDistributionChart') as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    if (this.roleDistributionChart) {
      this.roleDistributionChart.destroy();
    }

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: ['Super Admin', 'Admin', 'Employee'],
        datasets: [
          {
            label: 'Role Distribution',
            data: [
              this.dashboard.role_distribution.super_admin ?? 0,
              this.dashboard.role_distribution.admin ?? 0,
              this.dashboard.role_distribution.employee ?? 0,
            ],
            backgroundColor: ['#4e73df', '#6f42c1', '#20c997'],
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = Number(context.raw) || 0;
                return `${label}: ${value}`;
              },
            },
          },
        },
      },
    };

    this.roleDistributionChart = new Chart(canvas, config);
  }

  private renderTopEmployeesChart(): void {
    if (!this.dashboard?.top_employees?.length) {
      return;
    }

    const canvas = document.getElementById('topEmployeesChart') as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    if (this.topEmployeesChart) {
      this.topEmployeesChart.destroy();
    }

    const labels = this.dashboard.top_employees.map((employee) => employee.employee_name);
    const values = this.dashboard.top_employees.map((employee) => employee.completed_tasks ?? 0);

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Completed Tasks',
            data: values,
            backgroundColor: ['#0d6efd', '#20c997', '#6f42c1', '#fd7e14', '#198754'],
            borderRadius: 10,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
            grid: {
              color: 'rgba(0,0,0,0.06)',
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = Number(context.raw) || 0;
                return `Completed Tasks: ${value}`;
              },
            },
          },
        },
      },
    };

    this.topEmployeesChart = new Chart(canvas, config);
  }

  ngOnDestroy(): void {
    if (this.taskStatusChart) {
      this.taskStatusChart.destroy();
      this.taskStatusChart = null;
    }

    if (this.roleDistributionChart) {
      this.roleDistributionChart.destroy();
      this.roleDistributionChart = null;
    }

    if (this.topEmployeesChart) {
      this.topEmployeesChart.destroy();
      this.topEmployeesChart = null;
    }
  }
}
