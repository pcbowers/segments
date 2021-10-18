import Index from '../src/routes/index.svelte';
import { render } from '@testing-library/svelte';

test('shows proper heading when rendered', () => {
	const { getByText } = render(Index);
	expect(getByText('Welcome to Segments')).toBeInTheDocument();
});
