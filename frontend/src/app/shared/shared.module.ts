import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, icons } from 'lucide-angular';

@NgModule({
    imports: [
        CommonModule,
        LucideAngularModule.pick({
            LayoutDashboard: icons.LayoutDashboard,
            Calendar: icons.Calendar,
            Folders: icons.Folders,
            Package: icons.Package,
            Truck: icons.Truck,
            Shuffle: icons.Shuffle,
            ShoppingCart: icons.ShoppingCart,
            CreditCard: icons.CreditCard,
            User: icons.User,
            LogOut: icons.LogOut,
            Menu: icons.Menu,
            ChevronLeft: icons.ChevronLeft,
            ChevronRight: icons.ChevronRight,
            ChevronDown: icons.ChevronDown,
            ChevronUp: icons.ChevronUp,
            PlusCircle: icons.CirclePlus, // icons.CirclePlus is existed, not icons.PlusCircle (this on is depricated)
            Save: icons.Save,
            Pencil: icons.Pencil,
            Trash2: icons.Trash2,
            GripVertical: icons.GripVertical,
            Inbox: icons.Inbox
        }),
    ],
    exports: [LucideAngularModule],
})
export class SharedModule { }
