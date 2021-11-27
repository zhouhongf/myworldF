import {Component, OnInit} from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {bankworkCompanyType, bankworkPersonType} from '../../../models/bank-standard';
import random from '@angular-devkit/schematics/src/rules/random';


@Component({
    selector: 'app-bank-work',
    templateUrl: './bank-work.component.html',
    styleUrls: ['./bank-work.component.scss'],
})
export class BankWorkComponent implements OnInit {
    target;
    bankworkCompanyList = bankworkCompanyType;
    bankworkPersonList = bankworkPersonType;
    bankworkList;

    constructor(
        private baseService: BaseService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.getRouteParams();
    }

    getRouteParams() {
        this.route.paramMap.subscribe(data => {
            this.target = data.get('target');
            if (this.target === '公司金融') {
                this.bankworkList = this.bankworkCompanyList;
            } else {
                this.bankworkList = this.bankworkPersonList;
            }
        });
    }

    goToPage(name) {
        return this.router.navigate(['/bank/text', {keyone: this.target, keytwo: name}]);
    }
}
