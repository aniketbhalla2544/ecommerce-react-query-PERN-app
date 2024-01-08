import appRoutes from '../constants/app.routes';
import useAppStore from '../stores/zustand/zustand.store';
import { queryClient } from '../main';
import { router } from '@config/routes.config';

export function resetAppState() {
  useAppStore.getState().resetAppState();
  router.navigate(appRoutes.SIGNIN, {
    replace: true,
  });
  queryClient.removeQueries({
    type: 'all',
  });
}
