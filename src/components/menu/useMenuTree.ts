import { computed } from 'vue';
import { RouteRecordNormalized, RouteRecordRaw, useRouter } from 'vue-router';
import usePermission from '@/hooks/permission';
import { useAppStore } from '@/store';

export default function useMenuTree() {
  const router = useRouter();
  const permission = usePermission();
  const appStore = useAppStore();
  const appRoute = computed(() => {
    return appStore.appServerMenuConfig;
  });
  const menuTree = computed(() => {
    const copyRouter = JSON.parse(JSON.stringify(appRoute.value));
    copyRouter.sort((a: RouteRecordNormalized, b: RouteRecordNormalized) => {
      return (a.meta.order || 0) - (b.meta.order || 0);
    });
    function travel(_routes: RouteRecordRaw[], layer: number) {
      if (!_routes) return null;

      const collector: any = _routes.map((element) => {
        // no access
        if (!permission.accessRouter(element)) {
          return null;
        }

        // leaf node
        if (element.meta?.hideChildrenInMenu || !element.children) {
          element.children = [];
          return element;
        }

        // route filter hideInMenu true
        element.children = element.children.filter(
          (x) => x.meta?.hideInMenu !== true
        );

        // Associated child node
        element.children = travel(element.children, layer + 1);

        if (element.meta?.hideInMenu === false) {
          return element;
        }

        return null;
      });

      return collector.filter(Boolean);
    }
    return travel(copyRouter, 0);
  });
  return {
    menuTree,
  };
}
