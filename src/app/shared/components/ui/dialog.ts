import { Component, computed, Directive, input } from "@angular/core";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { lucideX } from "@ng-icons/lucide";

import {
  RdxDialogBackdrop,
  RdxDialogClose,
  RdxDialogDescription,
  RdxDialogPopup,
  RdxDialogPortal,
  RdxDialogRoot,
  RdxDialogTitle,
  RdxDialogTrigger,
} from "@radix-ng/primitives/dialog";
export { createRdxDialogHandle } from "@radix-ng/primitives/dialog";
import { cn } from "../../lib/utils";

@Directive({
  standalone: true,
  selector: "[ubDialogRoot]",
  exportAs: "ubDialogRoot",
  hostDirectives: [
    {
      directive: RdxDialogRoot,
      inputs: ["open", "defaultOpen", "modal", "disablePointerDismissal", "handle"],
      outputs: ["openChange"],
    },
  ],
})
export class UbDialogRootDirective {}

@Directive({
  standalone: true,
  selector: "button[ubDialogTrigger]",
  hostDirectives: [
    {
      directive: RdxDialogTrigger,
      inputs: ["handle", "payload", "id", "disabled"],
    },
  ],
})
export class UbDialogTriggerDirective {}

@Directive({
  standalone: true,
  selector: "ng-template[ubDialogPortal]",
  hostDirectives: [
    {
      directive: RdxDialogPortal,
      inputs: ["container"],
    },
  ],
})
export class UbDialogPortalDirective {}

@Directive({
  standalone: true,
  selector: "div[ubDialogBackdrop]",
  host: {
    "[class]": "computedClass()",
  },
  hostDirectives: [RdxDialogBackdrop],
})
export class UbDialogBackdropDirective {
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
  selector: "div[ubDialogPopup]",
  imports: [RdxDialogClose, NgIconComponent],
  host: {
    "[class]": "computedClass()",
  },
  hostDirectives: [RdxDialogPopup],
  viewProviders: [provideIcons({ lucideX })],
  template: `
    <ng-content />

    <button
      class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      rdxDialogClose
    >
      <ng-icon name="lucideX" />
      <span class="sr-only">Close</span>
    </button>
  `,
})
export class UbDialogPopupComponent {
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
  selector: "button[ubDialogClose]",
  hostDirectives: [RdxDialogClose],
})
export class UbDialogCloseDirective {}

@Directive({
  standalone: true,
  selector: "div[ubDialogHeader]",
  host: {
    "[class]": "computedClass()",
  },
})
export class UbDialogHeaderDirective {
  class = input<string>();
  computedClass = computed(() =>
    cn("flex flex-col space-y-1.5 text-center sm:text-left", this.class()),
  );
}

@Directive({
  standalone: true,
  selector: "div[ubDialogFooter]",
  host: {
    "[class]": "computedClass()",
  },
})
export class UbDialogFooterDirective {
  class = input<string>();
  computedClass = computed(() =>
    cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", this.class()),
  );
}

@Directive({
  standalone: true,
  selector: "h2[ubDialogTitle]",
  host: {
    "[class]": "computedClass()",
  },
  hostDirectives: [RdxDialogTitle],
})
export class UbDialogTitleDirective {
  class = input<string>();
  computedClass = computed(() =>
    cn("text-lg font-semibold leading-none tracking-tight", this.class()),
  );
}

@Directive({
  standalone: true,
  selector: "p[ubDialogDescription]",
  host: {
    "[class]": "computedClass()",
  },
  hostDirectives: [RdxDialogDescription],
})
export class UbDialogDescriptionDirective {
  class = input<string>();
  computedClass = computed(() => cn("text-sm text-muted-foreground", this.class()));
}
