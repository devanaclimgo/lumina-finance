import { Component, computed, Directive, input } from "@angular/core";

import {
  RdxAlertDialogBackdrop,
  RdxAlertDialogClose,
  RdxAlertDialogDescription,
  RdxAlertDialogPopup,
  RdxAlertDialogPortal,
  RdxAlertDialogRoot,
  RdxAlertDialogTitle,
  RdxAlertDialogTrigger,
  createRdxAlertDialogHandle,
} from "@radix-ng/primitives/alert-dialog";
import { cn } from "../../lib/utils";

export { createRdxAlertDialogHandle };

@Directive({
  standalone: true,
  selector: "[ubAlertDialogRoot]",
  exportAs: "ubAlertDialogRoot",
  hostDirectives: [RdxAlertDialogRoot],
})
export class UbAlertDialogRootDirective {}

@Directive({
  standalone: true,
  selector: "button[ubAlertDialogTrigger]",
  hostDirectives: [RdxAlertDialogTrigger],
})
export class UbAlertDialogTriggerDirective {}

@Directive({
  standalone: true,
  selector: "ng-template[ubAlertDialogPortal]",
  hostDirectives: [RdxAlertDialogPortal],
})
export class UbAlertDialogPortalDirective {}

@Directive({
  standalone: true,
  selector: "div[ubAlertDialogBackdrop]",
  host: {
    "[class]": "computedClass()",
  },
  hostDirectives: [RdxAlertDialogBackdrop],
})
export class UbAlertDialogBackdropDirective {
  class = input<string>();
  computedClass = computed(() =>
    cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      this.class(),
    ),
  );
}

@Component({
  standalone: true,
  selector: "div[ubAlertDialogPopup]",
  host: {
    "[class]": "computedClass()",
  },
  hostDirectives: [RdxAlertDialogPopup],
  template: `<ng-content />`,
})
export class UbAlertDialogPopupComponent {
  class = input<string>();
  computedClass = computed(() =>
    cn(
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
      this.class(),
    ),
  );
}

@Directive({
  standalone: true,
  selector: "button[ubAlertDialogClose]",
  hostDirectives: [RdxAlertDialogClose],
})
export class UbAlertDialogCloseDirective {}

@Directive({
  standalone: true,
  selector: "div[ubAlertDialogHeader]",
  host: {
    "[class]": "computedClass()",
  },
})
export class UbAlertDialogHeaderDirective {
  class = input<string>();
  computedClass = computed(() =>
    cn("flex flex-col space-y-1.5 text-center sm:text-left", this.class()),
  );
}

@Directive({
  standalone: true,
  selector: "div[ubAlertDialogFooter]",
  host: {
    "[class]": "computedClass()",
  },
})
export class UbAlertDialogFooterDirective {
  class = input<string>();
  computedClass = computed(() =>
    cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", this.class()),
  );
}

@Directive({
  standalone: true,
  selector: "h2[ubAlertDialogTitle]",
  host: {
    "[class]": "computedClass()",
  },
  hostDirectives: [RdxAlertDialogTitle],
})
export class UbAlertDialogTitleDirective {
  class = input<string>();
  computedClass = computed(() =>
    cn("text-lg font-semibold leading-none tracking-tight", this.class()),
  );
}

@Directive({
  standalone: true,
  selector: "p[ubAlertDialogDescription]",
  host: {
    "[class]": "computedClass()",
  },
  hostDirectives: [RdxAlertDialogDescription],
})
export class UbAlertDialogDescriptionDirective {
  class = input<string>();
  computedClass = computed(() => cn("text-sm text-muted-foreground", this.class()));
}

@Directive({
  standalone: true,
  selector: "button[ubAlertDialogAction]",
  host: {
    "[class]": "computedClass()",
  },
  hostDirectives: [RdxAlertDialogClose],
})
export class UbAlertDialogActionDirective {
  class = input<string>();
  computedClass = computed(() =>
    cn(
      "inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90",
      this.class(),
    ),
  );
}
