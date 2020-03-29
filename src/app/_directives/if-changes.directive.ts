import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appIfChanges]'
})
export class IfChangesDirective {
    private currentValue: any;
    private hasView = false;

    constructor(private viewContainer: ViewContainerRef, private templateRef: TemplateRef<any>) { }

    @Input()
    set appIfChanges(val: any) {
        if (!this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        } else if (val !== this.currentValue) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.currentValue = val;
        }
    }
}
