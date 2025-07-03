import {
  trigger,
  transition,
  style,
  query,
  animate,
} from '@angular/animations';

export const routeLoadAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0 }),
      animate('500ms ease-in-out', style({ opacity: 1})),
    ], { optional: true }),
  ]),
]);
