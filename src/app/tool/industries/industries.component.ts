import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {industries} from '../../models/industries';


export class ElementInstance {
  constructor(public itemCode: string, public itemName: string) { }
}

@Component({
  selector: 'industries',
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.scss']
})
export class IndustriesComponent {
  private _elementContent: string;
  @Output() onSelectorsKeyup = new EventEmitter();

  @Input()
  set elementContent(theContent: string) {
    this._elementContent = theContent;
    if (this._elementContent !== null && this._elementContent !== undefined) {
      const theData = this._elementContent.split('-');
      this.peopleSelectedData = [new ElementInstance('1', theData[1])];
      this.parent.patchValue(theData[0]);
      this.person.patchValue(theData[1]);
    }
  }

  get elementContent(): string {
    return this._elementContent;
  }

  theForm: FormGroup;
  theAllData = industries;

  parentsData: Array<object>;
  peopleSelectedData: Array<object>;

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
    this.parentsData = this.getParentsData();
  }


  createForm() {
    this.theForm = this.formBuilder.group({
      parent: '',
      person: '',
    });
  }

  get parent() {
    return this.theForm.get('parent');
  }

  get person() {
    return this.theForm.get('person');
  }


  getParentsData() {
    const result = [];
    for (let i = 0; i < this.theAllData.length; i++) {
      const value = this.theAllData[i];
      if (value['itemCode'].slice(2, 6) === '0000') {
        result.push(value);
      }
    }
    return result;
  }

  selectParent(code: string) {
    this.person.reset();
    this.peopleSelectedData = this.getPeopleData(code);
  }

  getPeopleData(code: string) {
    const result = [];
    for (let i = 0; i < this.theAllData.length; i++) {
      const value = this.theAllData[i];
      if (value['itemCode'].slice(0, 2) === code.slice(0, 2) && value['itemCode'] !== code && value['itemCode'].slice(4, 6) === '00') {
        result.push(value);
      }
    }
    return result;
  }

  selectPerson() {
    const allValue = this.parent.value + '-' + this.person.value;
    this.onSelectorsKeyup.emit(allValue);
  }

  resetData() {
    this.theForm.reset();
  }
}
