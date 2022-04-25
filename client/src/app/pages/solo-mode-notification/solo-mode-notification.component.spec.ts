import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoloModeNotificationComponent } from './solo-mode-notification.component';

describe('SoloModeNotificationComponent', () => {
    let component: SoloModeNotificationComponent;
    let fixture: ComponentFixture<SoloModeNotificationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SoloModeNotificationComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SoloModeNotificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
