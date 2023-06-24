import { Loader, Menu } from '@mantine/core';
import { SignOut } from '@phosphor-icons/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export interface NavbarProps {
  authenticated?: boolean;
}

const AuthenticatedSection = () => {
  const { data, status } = useSession();

  if (status === 'loading') {
    return <Loader />;
  }

  return (
    <>
      <Menu position="bottom-end" offset={15}>
        <Menu.Target>
          <Image
            src={data?.user?.image as string}
            alt="Profile"
            width={38}
            height={38}
            className="rounded-full cursor-pointer"
          />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item color="red" icon={<SignOut />}>
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export const Navbar = ({ authenticated = true }: NavbarProps) => {
  return (
    <nav className="px-8 py-6 flex items-center justify-between w-screen border-b">
      <section>
        <Link href={authenticated ? '/dashboard' : '/'}>
          <h1 className="font-semibold text-xl tracking-tighter text-red-500">
            Cardify
          </h1>
        </Link>
      </section>

      <section>{authenticated && <AuthenticatedSection />}</section>
    </nav>
  );
};
