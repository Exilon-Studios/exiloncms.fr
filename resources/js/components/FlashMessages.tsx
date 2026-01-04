import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { PageProps } from '@/types';

export default function FlashMessages() {
  const { flash } = usePage<PageProps>().props;

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
    if (flash?.info) {
      toast.info(flash.info);
    }
    if (flash?.warning) {
      toast.warning(flash.warning);
    }
  }, [flash]);

  return null;
}
