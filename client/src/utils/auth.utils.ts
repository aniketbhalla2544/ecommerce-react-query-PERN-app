import appRoutes from './app.routes';
import useAppStore from '../stores/zustand/appStore';
import { queryClient, router } from '../main';

export function resetAppState() {
  useAppStore.getState().resetAppState();
  router.navigate(appRoutes.SIGNIN, {
    replace: true,
  });
  queryClient.removeQueries({
    type: 'all',
  });
}
