import { Component, inject, OnInit } from '@angular/core';
import { DataFilterService } from '../../services/data-filter-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-selection',
  imports: [ReactiveFormsModule],
  templateUrl: './data-selection.html',
  styleUrl: './data-selection.css'
})
export class DataSelection implements OnInit {
  protected readonly dataFilterService = inject(DataFilterService);

  startDateControl = new FormControl(this.dataFilterService.startDate());
  endDateControl = new FormControl(this.dataFilterService.endDate());

  ngOnInit() {
    this.startDateControl.setValue(
      this.dataFilterService.minStartDate
    );
    this.endDateControl.setValue(
      this.dataFilterService.maxEndDate
    );
  }

  protected onDateChange(event: Event, startDate: boolean) {
    console.log("date changed", event, startDate);
    const target = event.target as HTMLInputElement;
    if (startDate)
      this.dataFilterService.startDate.set(new Date(target.value));
    else
      this.dataFilterService.endDate.set(new Date(target.value));
  }
}
