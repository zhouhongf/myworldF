import { Component, OnInit } from '@angular/core';
import {bankNameData, bankNameLink} from '../../../models/bank-name';
import {FormControl, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {map, startWith} from 'rxjs/operators';
import {APIService} from '../../../providers/api.service';

@Component({
  selector: 'app-bank-home',
  templateUrl: './bank-home.component.html',
  styleUrls: ['./bank-home.component.scss'],
})
export class BankHomeComponent implements OnInit {
  theData = bankNameData;
  showSearch = false;

  myControl = new FormControl('', Validators.required);
  filteredOptions: Observable<string[]>;

  bankNames = bankNameLink;
  bankNamesState = [];
  bankNamesComp = [];
  bankNamesCity = [];
  bankNamesCounty = [];

  constructor(private baseService: BaseService, private route: ActivatedRoute,  private router: Router) { }

  ngOnInit() {
    this.initBankLogos();
  }

  initBankLogos() {
    for (const one of this.bankNames) {
      switch (one.type) {
        case 'state':
          const dataState = {name: one.name, fullname: one.fullname, logo: APIService.assetsBankLogoSmall + one.name + '.png'};
          this.bankNamesState.push(dataState);
          break;
        case 'comp':
          const dataComp = {name: one.name, fullname: one.fullname, logo: APIService.assetsBankLogoSmall + one.name + '.png'};
          this.bankNamesComp.push(dataComp);
          break;
        case 'city':
          const dataCity = {name: one.name, fullname: one.fullname, logo: APIService.assetsBankLogoSmall + one.name + '.png'};
          this.bankNamesCity.push(dataCity);
          break;
        case 'county':
          const dataCounty = {name: one.name, fullname: one.fullname, logo: APIService.assetsBankLogoSmall + one.name + '.png'};
          this.bankNamesCounty.push(dataCounty);
          break;
      }
    }
  }

  search() {
    this.showSearch = true;
    this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.theData.filter(option => option.toLowerCase().includes(filterValue));
    }
  }

  searchCancel() {
    this.myControl.reset();
    this.showSearch = false;
  }

  searchReset() {
    this.myControl.reset();
    this.search();
  }

  selectThis(option) {
    this.myControl.setValue(option);
    // return this.router.navigate(['/bank/blog', {param: this.myControl.value}]);
  }

  goToPage(target) {
    return this.router.navigate(['/bank/blog', {target}]);
  }


}
