import { createFileRoute } from '@tanstack/react-router';
import RouteComponent from '../Components/website';

export const Route = createFileRoute('/solar-square')({
	component: RouteComponent,
});
