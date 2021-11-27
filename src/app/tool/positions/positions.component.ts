import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {positions} from '../../models/positions';


export class ElementInstance {
  constructor(public itemCode: string, public itemName: string) { }
}

@Component({
  selector: 'positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent {
  private _elementContent: string;
  @Output() onSelectorsKeyup = new EventEmitter();

  @Input()
  set elementContent(theContent: string) {
    this._elementContent = theContent;
    if (this._elementContent !== null && this._elementContent !== undefined) {
      const theData = this._elementContent.split('-');
      this.peopleSelectedData = [new ElementInstance('1', theData[1])];
      this.childrenSelectedData = [new ElementInstance('2', theData[2])];
      this.parent.patchValue(theData[0]);
      this.person.patchValue(theData[1]);
      this.child.patchValue(theData[2]);
    }
  }

  get elementContent(): string {
    return this._elementContent;
  }

  theForm: FormGroup;

  theAllData = positions;
  parentsData: Array<object>;
  peopleSelectedData: Array<object>;
  childrenSelectedData: Array<object>;

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
    this.parentsData = this.getParentsData();
  }


  createForm() {
    this.theForm = this.formBuilder.group({
      parent: '',
      person: '',
      child: '',
    });
  }

  get parent() {
    return this.theForm.get('parent');
  }

  get person() {
    return this.theForm.get('person');
  }

  get child() {
    return this.theForm.get('child');
  }

  getCode(value) {
    let code;
    for (const one of this.theAllData) {
      if (one['itemName'] === value) {
        code = one['itemCode']
        break;
      }
    }
    return code;
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
    this.child.reset();
    this.childrenSelectedData = undefined;
    this.peopleSelectedData = this.getPeopleSelectedData(code);
  }

  getPeopleSelectedData(code: string) {
    const result = [];
    for (let i = 0; i < this.theAllData.length; i++) {
      const value = this.theAllData[i];
      if (value['itemCode'].slice(0, 2) === code.slice(0, 2) && value['itemCode'] !== code && value['itemCode'].slice(4, 6) === '00') {
        result.push(value);
      }
    }
    return result;
  }


  selectPerson(code: string) {
    this.child.reset();
    this.childrenSelectedData = this.getChildrenSelectedData(code);
  }

  getChildrenSelectedData(code: string) {
    const result = [];
    for (let i = 0; i < this.theAllData.length; i++) {
      const value = this.theAllData[i];
      if (value['itemCode'] !== code && value['itemCode'].slice(0, 4) === code.slice(0, 4)) {
        result.push(value);
      }
    }
    return result;
  }

  selectChild() {
    const allValue = this.parent.value + '-' + this.person.value + '-' + this.child.value;
    this.onSelectorsKeyup.emit(allValue);
  }

  public resetData() {
    this.theForm.reset();
  }

}
