import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-search-main',
  templateUrl: './search-main.component.html',
  styleUrls: ['./search-main.component.scss'],
})
export class SearchMainComponent implements OnInit {

  @ViewChild('mainSearch', {static: false}) mainSearch: ElementRef;
  searchContent = new FormControl('', Validators.required);

  cityname;
  imageUrl = 'url(assets/images/dengShanRen.jpg)';
  target;

  constructor(private baseService: BaseService, private router: Router, private route: ActivatedRoute, private storage: Storage,) {
  }

  ngOnInit() {
    this.cityname = localStorage.getItem(APIService.SAVE_LOCAL.currentCity);
    this.route.paramMap.subscribe(data => {
      this.target = data.get('target');
      this.getSlides();
    });
  }

  getSlides() {
    let slides = [];
    this.storage.get(APIService.SAVE_STORAGE.allSlides).then(data =>  {
      if (data) {
        slides = data.data;
        const total = slides.length;
        const randomNum = Math.floor(Math.random() * total);
        this.imageUrl = slides[randomNum].image;
      }
    })
  }

  search() {
    const words = this.searchContent.value;
    if (words) {
      return this.router.navigate(['/search/result', {words}]).then(() => {
        this.searchContent.reset();
      });
    }
  }
}
