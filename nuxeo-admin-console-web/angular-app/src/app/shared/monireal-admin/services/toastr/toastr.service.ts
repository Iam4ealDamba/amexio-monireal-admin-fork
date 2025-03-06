import {ToastrConfig, ToastrService} from 'ngx-toastr';
import {Injectable} from "@angular/core";
import {ToastrLevelType} from "../../interfaces/types";

@Injectable({
  providedIn: "root"
})
export class ToastrCustomService {
  constructor(private toastrService: ToastrService) {
  }
  
  showToast(level: ToastrLevelType, message: string, title?: string | "") {
    switch (level) {
      case "Info":
        return this.toastrService.info(message, title);
      case "Success":
        return this.toastrService.success(message, title);
      case "Warning":
        return this.toastrService.warning(message, title);
      case "Danger":
        return this.toastrService.error(message, title);
      default:
        return this.toastrService.info(message, title);
    }
  }
}