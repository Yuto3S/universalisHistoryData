import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';

interface FileToDisplay {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  public rowData$?: any[];
  fileList: FileToDisplay[] = [];
  selectedFile: string = "";
  selectedDate = "";
  selectedItem?: {
    data: Object,
    linkHref: string,
    linkDisplayedText: string
  };
//   selectedItemLink?: string;

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;


  changeFileSelected(newSelectedFile: any) {
    console.log("ok");
    fetch(`assets/${this.selectedDate}/${newSelectedFile}.json`).then(res => res.json()).then(
      jsonData => {
        this.columnDefs = [];
        jsonData["columns"].map((element: any) => this.columnDefs.push({field: element}));
        this.rowData$ = jsonData["items"];
      }
    );
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    fetch(`assets/latest_generated.json`).then(res => res.json()).then(
      jsonData => {
        this.selectedDate = jsonData["folder"];
        fetch(`assets/${this.selectedDate}/list_of_files.json`).then(res => res.json()).then(
          fileList => {
            fileList.sort();
            fileList.forEach((fileName: string) => {
              let viewValue = fileName.replace(/_/g, " ");
              this.fileList.push({value: fileName, viewValue: viewValue});
            });
            this.selectedFile = this.fileList[0].value;
            this.changeFileSelected(this.selectedFile);
          }
        );
      }
    );
  }

  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
//     console.log('cellClicked', e.data);
//         console.log(this.selectedItem);

    this.selectedItem = {
      data: e.data,
      linkHref: `https://universalis.app/market/${e.data['_id']}`,
      linkDisplayedText: e.data['Item Name']
    }
//     this.selectedItemLink = `https://universalis.app/market/${e.data['_id']}`
//     console.log(this.selectedItemLink);
//     console.log(this.selectedItem);
  }

//   (click)="onSelect(hero)"

  // Example using Grid's API
  clearSelection(): void {
    this.agGrid.api.deselectAll();
  }

  openDialog() {
    console.log("open dialog");
  }
}
