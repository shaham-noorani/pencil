import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from "react-router-dom";

interface DeleteUserButtonProps {
  userId: string;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ userId }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const toast = useToast();
  const navigate = useNavigate();

  const deleteUser = async () => {
    setIsDeleting(true);
    try {
      await axiosPrivate.delete(`/users/${userId}`);
      toast({
        title: 'User deleted',
        description: `The user with ID ${userId} has been successfully deleted.`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        title: 'Error',
        description: 'There was an error deleting the user. Please try again.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
    setIsDeleting(false);
  };

  return (
    <Button
      colorScheme="red"
      isLoading={isDeleting}
      onClick={deleteUser}
      disabled={isDeleting}
    >
      Delete User
    </Button>
  );
};

export default DeleteUserButton;
