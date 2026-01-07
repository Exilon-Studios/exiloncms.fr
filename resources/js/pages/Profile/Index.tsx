/**
 * Profile Page - Edit user profile
 * Using same structure as Admin/Users/Edit
 */

import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEvent, useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, User, Role } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutContent,
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { trans } from '@/lib/i18n';

interface ProfileProps extends PageProps {
  user: User;
  canChangeName: boolean;
  canUploadAvatar: boolean;
  hasAvatar: boolean;
  canDelete: boolean;
  canVerifyEmail: boolean;
  discordAccount: any;
  enableDiscordLink: boolean;
  settings: {
    money: string;
  };
}

export default function ProfileIndex({
  user,
  canChangeName,
  canUploadAvatar,
  hasAvatar,
  canDelete,
  canVerifyEmail,
  discordAccount,
  enableDiscordLink,
  settings,
}: ProfileProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    name: user.name,
    email: user.email || '',
    email_confirm_pass: '',
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(trans('admin.users.edit.fix_errors'));
    }
  }, [errors]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('profile.name'));
  };

  const updateEmail = () => {
    post(route('profile.email'));
  };

  const verifyEmail = () => {
    router.post(route('profile.verify.resend'), {
      onSuccess: () => toast.success(trans('admin.users.edit.verify_sent')),
      onError: () => toast.error(trans('admin.users.edit.verify_failed')),
    });
  };

  const deleteAvatar = () => {
    router.delete(route('profile.avatar.delete'), {
      onSuccess: () => toast.success(trans('messages.profile.delete_avatar')),
      onError: () => toast.error(trans('messages.status.error', { error: 'Failed to delete avatar' })),
    });
  };

  const linkDiscord = () => {
    router.get(route('profile.discord.link'));
  };

  const unlinkDiscord = () => {
    router.post(route('profile.discord.unlink'));
  };

  const deleteAccount = () => {
    setIsDeleting(true);
    router.post(route('profile.delete.send'), {}, {
      onSuccess: () => {
        toast.success(trans('messages.profile.delete.sent'));
        setDeleteDialogOpen(false);
      },
      onError: () => {
        toast.error(trans('messages.status.error', { error: 'Failed to send deletion email' }));
      },
      onFinish: () => {
        setIsDeleting(false);
      },
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('messages.profile.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('messages.profile.title')}
            description={trans('messages.nav.profile')}
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Edit Profile */}
            <Card>
              <CardHeader>
                <CardTitle>{trans('admin.users.edit.profile')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-4">
                  {/* Avatar Preview */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <img
                          src={`https://mc-heads.net/avatar/${user.name}/64`}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  {/* Name */}
                  {canChangeName && (
                    <div className="space-y-2">
                      <Label htmlFor="name">{trans('admin.users.edit.name')}</Label>
                      <Input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">{trans('admin.users.edit.email')}</Label>
                    <InputGroup className="rounded-md h-10">
                      <InputGroupInput
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="h-full"
                      />
                      {user.email_verified_at ? (
                        <InputGroupAddon className="px-3 bg-green-500/20 text-green-600 dark:text-green-400 h-full">
                          <span className="text-sm font-medium">email</span>
                        </InputGroupAddon>
                      ) : (
                        <InputGroupAddon className="h-full">
                          <InputGroupButton
                            type="button"
                            onClick={verifyEmail}
                            className="rounded-l-none h-full w-full"
                          >
                            {trans('admin.users.edit.verify')}
                          </InputGroupButton>
                        </InputGroupAddon>
                      )}
                    </InputGroup>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  {/* Email Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="email_confirm_pass">{trans('admin.users.edit.password')}</Label>
                    <Input
                      id="email_confirm_pass"
                      type="password"
                      value={data.email_confirm_pass}
                      onChange={(e) => setData('email_confirm_pass', e.target.value)}
                      placeholder={trans('messages.profile.current_password')}
                    />
                    {errors.email_confirm_pass && (
                      <p className="text-sm text-destructive">{errors.email_confirm_pass}</p>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="pt-4">
                    <ButtonGroup>
                      {canChangeName && (
                        <Button type="submit" disabled={processing}>
                          {processing ? trans('admin.users.edit.saving') : trans('messages.actions.save')}
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={updateEmail}
                      >
                        {trans('messages.profile.change_email')}
                      </Button>
                    </ButtonGroup>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Right Column - Information & Options */}
            <Card>
              <CardHeader>
                <CardTitle>{trans('admin.users.edit.information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Registered */}
                <div className="space-y-2">
                  <Label>{trans('admin.users.registered')}</Label>
                  <Input value={formatDate(user.created_at)} disabled />
                </div>

                {/* Last Login */}
                {user.last_login_at && (
                  <div className="space-y-2">
                    <Label>{trans('admin.users.last_login')}</Label>
                    <Input value={formatDate(user.last_login_at)} disabled />
                  </div>
                )}

                {/* Email Verified */}
                <div className="space-y-2">
                  <Label>{trans('admin.users.edit.email_verified')}</Label>
                  {user.email_verified_at ? (
                    <Input
                      value={trans('admin.users.edit.email_verified_yes', { date: formatDate(user.email_verified_at) })}
                      disabled
                      className="text-green-600"
                    />
                  ) : (
                    canVerifyEmail ? (
                      <div className="flex gap-2">
                        <Input value={trans('admin.users.edit.email_verified_no')} disabled className="text-red-600" />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={verifyEmail}
                        >
                          {trans('admin.users.edit.verify')}
                        </Button>
                      </div>
                    ) : (
                      <Input value={trans('admin.users.edit.email_verified_no')} disabled className="text-red-600" />
                    )
                  )}
                </div>

                {/* 2FA Status */}
                <div className="space-y-2">
                  <Label>{trans('admin.users.edit.two_factor')}</Label>
                  <Input
                    value={user.two_factor_secret ? trans('admin.users.edit.two_factor_yes') : trans('admin.users.edit.two_factor_no')}
                    disabled
                    className={user.two_factor_secret ? 'text-green-600' : 'text-red-600'}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.get(route('profile.2fa.index'))}
                  >
                    {user.two_factor_secret ? trans('messages.profile.2fa.manage') : trans('messages.profile.2fa.enable')}
                  </Button>
                </div>

                {/* Money */}
                <div className="space-y-2">
                  <Label>{trans('messages.fields.money')}</Label>
                  <Input value={`${user.money} ${settings.money || 'Points'}`} disabled />
                </div>

                {/* Discord */}
                {enableDiscordLink && (
                  <div className="space-y-2">
                    <Label>{trans('admin.users.discord')}</Label>
                    {discordAccount ? (
                      <div className="flex gap-2">
                        <Input value={trans('messages.profile.info.discord', { user: discordAccount.username })} disabled />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={unlinkDiscord}
                        >
                          {trans('messages.profile.discord.unlink')}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={linkDiscord}
                      >
                        {trans('messages.profile.discord.link')}
                      </Button>
                    )}
                  </div>
                )}

                {/* Delete Account */}
                {canDelete && (
                  <div className="pt-4 border-t border-border">
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          className="w-full"
                        >
                          {trans('messages.profile.delete.btn')}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{trans('messages.profile.delete.title')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {trans('messages.profile.delete.info')}
                            <br /><br />
                            {trans('messages.profile.delete.email')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>
                            {trans('actions.cancel')}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.preventDefault();
                              deleteAccount();
                            }}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? trans('loading') : trans('messages.profile.delete.btn')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </AdminLayoutContent>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
