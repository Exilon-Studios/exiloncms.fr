/**
 * Modal Dialog Component
 * Composant de dialogue réutilisable pour les confirmations
 */

import * as React from 'react';
import { useModal } from '@/lib/modalManager';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

/**
 * Modal Dialog - Affiche les modales gérées par le ModalManager
 * Doit être placé dans le layout principal de l'application
 */
export function ModalDialog() {
  const { isModalOpen, modalConfig, hideModal } = useModal();

  if (!modalConfig) {
    return null;
  }

  const getVariantStyles = () => {
    switch (modalConfig.variant) {
      case 'danger':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
          confirmVariant: 'destructive' as const,
        };
      case 'warning':
        return {
          icon: <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />,
          confirmVariant: 'default' as const,
        };
      case 'info':
      default:
        return {
          icon: <Info className="h-6 w-6 text-blue-600 dark:text-blue-500" />,
          confirmVariant: 'default' as const,
        };
    }
  };

  const variantStyles = getVariantStyles();

  const handleConfirm = async () => {
    await modalConfig.onConfirm();
    hideModal();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && hideModal()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {variantStyles.icon}
            <DialogTitle>{modalConfig.title}</DialogTitle>
          </div>
          {modalConfig.description && (
            <DialogDescription className="pt-2">
              {modalConfig.description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={hideModal}>
            {modalConfig.cancelLabel || 'Annuler'}
          </Button>
          <Button variant={variantStyles.confirmVariant} onClick={handleConfirm}>
            {modalConfig.confirmLabel || 'Confirmer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
