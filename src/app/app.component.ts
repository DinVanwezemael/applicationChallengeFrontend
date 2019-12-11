import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from './authentication/services/authenticate.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as jwtDecode from 'jwt-decode';
//declare var $ : any;
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  searchForm: FormGroup;
  title = 'applicationChallenge';
  loggedIn = false;
  mobileNavigation = true;
  currentRole;

  constructor(private router: Router, private _authenticationService: AuthenticateService, private fb: FormBuilder) {
    this._authenticationService.checkUser();

    this._authenticationService.isLoggedin.subscribe(result => {
      this.loggedIn = result;
    }) 

    this._authenticationService.currentRole.subscribe(result => {
      this.currentRole = result;
    }) 
  }

  mobileNav(){
    console.log('test');
    if(this.mobileNavigation == true){
      this.mobileNavigation = false;
    }
    else{
      this.mobileNavigation = true
    }
  }
  
  public ngOnInit(){
    
      /* $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
      $("body").toggleClass("sidebar-toggled");
      $(".sidebar").toggleClass("toggled");
      if ($(".sidebar").hasClass("toggled")) {
        $('.sidebar .collapse').collapse('hide');
      };
    });
  
    // Close any open menu accordions when window is resized below 768px
    $(window).resize(function() {
      if ($(window).width() < 768) {
        $('.sidebar .collapse').collapse('hide');
      };
    });
  
    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
      if ($(window).width() > 768) {
        var e0 = e.originalEvent,
          delta = e0.wheelDelta || -e0.detail;
        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
      }
    });
  
    // Scroll to top button appear
    $(document).on('scroll', function() {
      var scrollDistance = $(this).scrollTop();
      if (scrollDistance > 100) {
        $('.scroll-to-top').fadeIn();
      } else {
        $('.scroll-to-top').fadeOut();
      }
    });
  
    // Smooth scrolling using jQuery easing
    $(document).on('click', 'a.scroll-to-top', function(e) {
      var $anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: ($($anchor.attr('href')).offset().top)
      }, 1000, 'easeInOutExpo');
      e.preventDefault();
    }); */

    this.searchForm = this.fb.group({
    })

  }
  onLogout() {
      localStorage.removeItem("token");
      this._authenticationService.isLoggedin.next(false);
      this.router.navigate(['/login']);
  }
}

