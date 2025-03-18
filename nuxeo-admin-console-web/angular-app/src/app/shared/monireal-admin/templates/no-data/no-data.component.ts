import {Component, Input} from "@angular/core";

/**
 * A template to show when no data was found in a component
 */
@Component({
  selector: "app-no-data",
  templateUrl: "./no-data.component.html",
  styleUrls: ["./no-data.component.scss"],
  standalone: true
})
export class NoDataComponent {
  /**
   * Custom text to show on the template
   */
  @Input() text = "";
}