import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {bankTypeData, idTypeData, offerData} from '../../../models/system-data';
import {bankNameData} from '../../../models/bank-name';
import {Observable} from 'rxjs';
import {PositionsComponent} from '../../../tool/positions/positions.component';
import {IndustriesComponent} from '../../../tool/industries/industries.component';
import {CityLinksComponent} from '../../../tool/city-links/city-links.component';
import {BaseService} from '../../../providers/base.service';
import {Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-sysuser-info',
  templateUrl: './sysuser-info.component.html',
  styleUrls: ['./sysuser-info.component.scss'],
})
export class SysuserInfoComponent implements OnInit {
  userInfoForm: FormGroup;
  toShow = false;

  accountStatus: string;
  cityLinksValue: string;
  positionValue: string;
  industryValue: string;
  theIdTypeData = idTypeData;
  theBankTypeData = bankTypeData;
  theOfferData = offerData;
  theData = bankNameData;
  filteredOptions: Observable<string[]>;

  @ViewChild(PositionsComponent, {static: false}) positionsComponent: PositionsComponent;
  @ViewChild(IndustriesComponent, {static: false}) industriesComponent: IndustriesComponent;
  @ViewChild(CityLinksComponent, {static: false}) cityLinkComponent: CityLinksComponent;

  constructor(private formBuilder: FormBuilder, private baseService: BaseService, private router: Router) {
    this.createForm();
  }

  ngOnInit() {
    this.getUserInfo();
  }

  goBack() {
    return this.router.navigate(['/sysuser/settings']);
  }

  getUserInfo() {
    this.baseService.httpGet(APIService.SYSUSER.getUserInfo, null, data => {
      if (data.code === 0) {
        const value = this.baseService.cDecrypt(data.data);
        const theData = JSON.parse(value);
        console.log('解析出来的用户内容是：', theData);
        this.accountStatus = theData.accountStatus;
        this.resetForm(theData);
      }
    });
  }

  createForm() {
    this.userInfoForm = this.formBuilder.group({
      playerType: '',
      realname: '',
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      idtype: ['', Validators.required],
      offer: '',
      position: ['', Validators.required],
      industry: ['', Validators.required],
      company: ['', Validators.required],
      placebelong: ['', Validators.required],
      address: ['', Validators.required],
    });
    this.filteredOptions = this.company.valueChanges.pipe(
        startWith(''),
        map(val => this._filter(val))
    );
  }

  private _filter(value: string): string[] {
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.theData.filter(option => option.toLowerCase().includes(filterValue));
    }
  }

  resetForm(thedata) {
    this.cityLinksValue = thedata.placebelong;
    this.positionValue = thedata.position;
    this.industryValue = thedata.industry;

    this.playerType.patchValue(thedata.playerType);
    this.realname.patchValue(thedata.realname);
    this.gender.patchValue(thedata.gender);
    this.email.patchValue(thedata.email);
    this.idtype.patchValue(thedata.idtype);
    this.position.patchValue(thedata.position);
    this.placebelong.patchValue(thedata.placebelong);
    this.address.patchValue(thedata.address);

    if (thedata.offer) {
      const offerArray = JSON.parse(thedata.offer);
      this.offer.patchValue(offerArray);
    }

    this.industry.patchValue(thedata.industry);
    this.company.patchValue(thedata.company);
  }

  keyupHandlerOnPosition(event) {
    return this.position.patchValue(event);
  }

  keyupHandlerOnIndustry(event) {
    return this.industry.patchValue(event);
  }

  keyupHandlerOnPlaceBelong(event) {
    return this.placebelong.patchValue(event);
  }

  get playerType() {
    return this.userInfoForm.get('playerType');
  }

  get realname() {
    return this.userInfoForm.get('realname');
  }

  get gender() {
    return this.userInfoForm.get('gender');
  }

  get email() {
    return this.userInfoForm.get('email');
  }

  get idtype() {
    return this.userInfoForm.get('idtype');
  }

  get offer() {
    return this.userInfoForm.get('offer');
  }

  get position() {
    return this.userInfoForm.get('position');
  }

  get industry() {
    return this.userInfoForm.get('industry');
  }

  get company() {
    return this.userInfoForm.get('company');
  }

  get placebelong() {
    return this.userInfoForm.get('placebelong');
  }

  get address() {
    return this.userInfoForm.get('address');
  }

  doSubmit() {
    if (this.idtype.value === '银行人员') {
      this.playerType.patchValue('BANKER');
    }
    const formJson = this.userInfoForm.value;
    if (this.offer.value) {
      formJson.offer = JSON.stringify(this.offer.value);
    }
    console.log('表格内容是：', formJson);
    const formValue = this.baseService.cEncrypt(JSON.stringify(formJson));
    this.baseService.httpPost(APIService.SYSUSER.setUserInfo, null, formValue, data => {
      if (data.code === 0) {
        return this.router.navigate(['/sysuser']).then(() => {
          this.toShow = false;
        });
      } else {
        this.baseService.presentToast(data.msg);
      }
    });
  }
}

