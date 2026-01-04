/**
 * Modal Manager
 * Système centralisé pour gérer les modales et dialogues de confirmation
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ModalConfig {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
}

interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
  isModalOpen: boolean;
  modalConfig: ModalConfig | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * Provider pour le système de modales
 * À envelopper autour de l'application (par ex. dans app.tsx ou le layout principal)
 */
export function ModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  const showModal = useCallback((config: ModalConfig) => {
    setModalConfig(config);
    setIsModalOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsModalOpen(false);
    setModalConfig(null);
  }, []);

  return (
    <ModalContext.Provider value={{ showModal, hideModal, isModalOpen, modalConfig }}>
      {children}
    </ModalContext.Provider>
  );
}

/**
 * Hook pour utiliser les modales
 * @example
 * const { confirm } = useModal();
 *
 * // Usage basique
 * confirm({
 *   title: 'Supprimer ?',
 *   description: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
 *   variant: 'danger',
 *   onConfirm: () => {
 *     deleteItem();
 *   },
 * });
 */
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  const confirm = useCallback((config: ModalConfig): void => {
    context.showModal(config);
  }, [context]);

  return {
    ...context,
    confirm,
  };
}
