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
  selectedItem?: {
    data: Object,
    linkHref: string,
    linkDisplayedText: string
  };

  fullTreeInfo?: any;

  selectedShoppingListInfo?: {
    server: string,
    timeframe: string,
    dateGenerated: string,
    shoppingList: string,
  }

  selectedServer: string = "";
  selectedTimeFrame: string = "";
  selectedDate: string = "";
  selectedShoppingList: string = "";

  FFXIVServers?: any = [];
  shoppingListTimeframes?: any = [];
  availableDates?: any = [];
//   selectedItemLink?: string;

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  updateTableData() {
    fetch(`assets/history/${this.selectedServer}/${this.selectedTimeFrame}/${this.selectedDate}/${this.selectedShoppingList}`).then(res => res.json()).then(
      jsonData => {
        this.columnDefs = [];
        jsonData["columns"].map((element: any) => this.columnDefs.push({field: element}));
        this.rowData$ = jsonData["items"];
      }
    );
  }


  changeFileSelected(newSelectedFile: any) {
    this.selectedShoppingList = newSelectedFile;
    console.log("ok");
    console.log(newSelectedFile);
    console.log(this.selectedDate);
    this.updateTableData();
//     fetch(`assets/history/${this.selectedServer}/${this.selectedTimeFrame}/${this.selectedDate}/${this.selectedShoppingList}`).then(res => res.json()).then(
//       jsonData => {
//         this.columnDefs = [];
//         jsonData["columns"].map((element: any) => this.columnDefs.push({field: element}));
//         this.rowData$ = jsonData["items"];
//       }
//     );
  }

  changeServerSelected(newSelectedFFXIVServer: any){
    console.log(newSelectedFFXIVServer);
    this.selectedServer = newSelectedFFXIVServer;

    this.shoppingListTimeframes = Object.keys(this.fullTreeInfo["history"][this.selectedServer]);
    this.selectedTimeFrame = this.shoppingListTimeframes[0];

    this.availableDates = Object.keys(this.fullTreeInfo["history"][this.selectedServer][this.selectedTimeFrame]);
    this.availableDates.sort();
    this.selectedDate = this.availableDates[0];

    this.fileList = [];
    this.fullTreeInfo["history"][this.selectedServer][this.selectedTimeFrame][this.selectedDate].sort().forEach(
      (fileName: any) => {
        let viewValue = fileName.replace(/_/g, " ").replace(/.json/g, "");
        this.fileList.push({value: fileName, viewValue: viewValue});
      }
    );

    this.selectedShoppingList = this.fileList[0].value;
    this.updateTableData();
  }

  changeSelectedTimeFrame(newSelectedTimeFrame: any){
    console.log(newSelectedTimeFrame);
    this.selectedTimeFrame = newSelectedTimeFrame;

    this.availableDates = Object.keys(this.fullTreeInfo["history"][this.selectedServer][this.selectedTimeFrame]);
    this.availableDates.sort();
    this.selectedDate = this.availableDates[0];

    this.fileList = [];
    this.fullTreeInfo["history"][this.selectedServer][this.selectedTimeFrame][this.selectedDate].sort().forEach(
      (fileName: any) => {
        let viewValue = fileName.replace(/_/g, " ").replace(/.json/g, "");
        this.fileList.push({value: fileName, viewValue: viewValue});
      }
    );

    this.selectedShoppingList = this.fileList[0].value;
    this.updateTableData();
  }

  changeSelectedDate(newSelectedDate: any){
    console.log(newSelectedDate);
    this.selectedDate = newSelectedDate;

    this.fileList = [];
    this.fullTreeInfo["history"][this.selectedServer][this.selectedTimeFrame][this.selectedDate].sort().forEach(
      (fileName: any) => {
        let viewValue = fileName.replace(/_/g, " ").replace(/.json/g, "");
        this.fileList.push({value: fileName, viewValue: viewValue});
      }
    );

    this.selectedShoppingList = this.fileList[0].value;
    this.updateTableData();
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    fetch(`assets/history_tree.json`).then(res => res.json()).then(
      jsonData => {
        console.log(jsonData);
        this.fullTreeInfo = jsonData;

        this.FFXIVServers = Object.keys(jsonData["history"]);
        this.FFXIVServers.sort();
        this.selectedServer = this.FFXIVServers[1];

        this.shoppingListTimeframes = Object.keys(jsonData["history"][this.selectedServer]);
        this.selectedTimeFrame = this.shoppingListTimeframes[0];

        this.availableDates = Object.keys(jsonData["history"][this.selectedServer][this.selectedTimeFrame]);
        console.log(this.availableDates);
        this.availableDates.sort(function(a: string, b: string) {
          // Folders have the date written in a format YYYY-MM-DD
          // Potentially could add -HH-MM-SS in a future improvement, but this should be backward compatible as all new
          // folders will be created with this format too.
          a = a.split('-').join('');
          b = b.split('-').join('');
          return a > b ? -1 : a < b ? 1 : 0;
        });
        this.selectedDate = this.availableDates[0];

        jsonData["history"][this.selectedServer][this.selectedTimeFrame][this.selectedDate].sort().forEach(
          (fileName: any) => {
            let viewValue = fileName.replace(/_/g, " ").replace(/.json/g, "");
            this.fileList.push({value: fileName, viewValue: viewValue});
          }
        );

        this.selectedShoppingList = this.fileList[0].value;
        this.updateTableData();
      }
    );
  }

  onCellClicked( e: CellClickedEvent): void {
    this.selectedItem = {
      data: e.data,
      linkHref: `https://universalis.app/market/${e.data['_id']}`,
      linkDisplayedText: e.data['Item Name']
    }
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
