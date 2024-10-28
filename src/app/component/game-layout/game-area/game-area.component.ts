import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { GameComponentsService } from '../../../services/game-componenet.service';

@Component({
    selector: 'app-game-area',
    templateUrl: './game-area.component.html',
    styleUrl: './game-area.component.css',
    standalone: true,
    imports: [
        SharedModule
    ],

})

export class GameAreaComponenet implements OnInit {
    @Input() gameName: string = '';

    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true })
    dynamicComponentContainer!: ViewContainerRef;

    constructor(
        private gameComponentsService: GameComponentsService,
        private componentFactoryResolver: ComponentFactoryResolver
    ) { }

    ngOnInit(): void {
        this.loadDynamicComponent();
    }

    private loadDynamicComponent(): void {
        if (this.gameName !== '') {
            const component = this.gameComponentsService.getComponentByRoute(this.gameName);

            if (component) {
                const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
                this.dynamicComponentContainer.clear();
                this.dynamicComponentContainer.createComponent(componentFactory);
            }
        }
    }
}

