import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import { profileAPI } from '../../../API/profileAPI';
import { TableCell, IconButton, Chip, Button, Box, Collapse, Alert, Typography } from '@mui/material';
import Icon from '@mui/material/Icon';
import FullTable from '../../UI/FullTable';
import { RefreshTokens } from '../../../Helper/RefreshTokens';
import ProfileUpdate from './ProfileUpdate';
import { useNavigate } from 'react-router-dom';
import { userLogout } from '../../../Store/userSlice';

const columns = [
    {
        id: "profileId",
        label: "Id профіля",
        minWidth: 110,
    },
    {
        id: "email",
        label: "Пошта",
        minWidth: 150,
    },
    {
        id: "firstName",
        label: "Ім'я",
        minWidth: 150,
    },
    {
        id: "lastName",
        label: "Прізвище",
        minWidth: 150,
    },
    {
        id: "joiningDate",
        label: "Дата приєднання",
        minWidth: 150,
        format: (value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US");
        },
    },
];

const ProfileList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myProfileId = useSelector((store) => store.user.profileId);
    const myRoles = useSelector((store) => store.user.roles);
    const myIsAdmin = myRoles !== null ? myRoles.includes("Admin") : false;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [needRefetch, setNeedRefetch] = useState(Date.now());
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = React.useState(true);

    useEffect(() => {
        dispatch(setTitle({ title: "Профілі користувачів" }));
    }, []);

    useEffect(() => {
        if (myIsAdmin) fetchData();
    }, [page, rowsPerPage, needRefetch, myProfileId]);

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const fetchData = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await profileAPI.profiles(page + 1, rowsPerPage);
        if (result.successfully === true) {
            setData(result.data.pageContent);
            setTotalCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const handleEdit = (genre) => {
        setIsUpdateDialogOpen(true);
    };

    const handleDelete = (profileId) => {
        const deleteProfile = async (profileId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await profileAPI.deleteProfile(profileId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Профіль успішно видалено", severity: 'success', hideTime: 4000 }));
                    setPage(0);
                    setNeedRefetch(Date.now());
                    if (myProfileId === profileId) dispatch(userLogout());
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час видалення профіля:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        deleteProfile(profileId);
    };

    const additionalCols = [
        <TableCell key="roles" style={{ top: 60, minWidth: 150 }}>
            Roles
        </TableCell>,
        <TableCell key="actions" style={{ top: 60, minWidth: 50 }}>
            Actions
        </TableCell>
    ];

    const handleDeleteAdminRole = (profileId) => {
        const deleteAdminRole = async (profileId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await profileAPI.deleteAdminRole(profileId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Роль успішно видалено", severity: 'success', hideTime: 4000 }));
                    if (myProfileId === profileId) RefreshTokens();
                    setNeedRefetch(Date.now());
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час видалення ролі 'Адмін':", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        deleteAdminRole(profileId);
    };

    const handleAddAdminRole = (profileId) => {
        const addAdminRole = async (profileId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await profileAPI.addAdminRole(profileId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Роль успішно додано", severity: 'success', hideTime: 4000 }));
                    if (myProfileId === profileId) RefreshTokens();
                    setNeedRefetch(Date.now());
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час додавання ролі 'Адмін':", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        addAdminRole(profileId);
    };

    const roleChipProps = (role, profileId) => {
        switch (role) {
            case 'Viewer':
                return { color: 'info' };
            case 'Painter':
                return { color: 'success' };
            case 'Admin':
                return {
                    color: 'warning',
                    onDelete: () => handleDeleteAdminRole(profileId)
                };
            case 'NotAdmin':
                return {
                    deleteIcon: <Icon>add</Icon>,
                    onDelete: () => handleAddAdminRole(profileId)
                };
            default:
                return {};
        }
    }

    const renderRoles = (row) => {
        return (
            <>
                {row["roles"].map((role) => (
                    <Chip key={role} variant="outlined" label={role} {...roleChipProps(role, row["profileId"])} />
                ))}
                {!row["roles"].includes("Admin") && (
                    <Chip variant="outlined" label="Зробити адміном" {...roleChipProps("NotAdmin", row["profileId"])} />
                )}
            </>
        );
    }

    const renderInfoAlert = (
        <Box sx={{ width: '100%' }}>
            <Collapse in={isInfoOpen} >
                <Alert
                    variant="outlined" severity="info"
                    action={
                        <>
                            {myProfileId === null ? (
                                <Button onClick={() => navigate("/register", { replace: true })} color="inherit" size="small">
                                    Зареєструватись
                                </Button>
                            ) : (
                                <>
                                    <Button onClick={handleEdit} color="inherit" size="small">
                                        Змінити
                                    </Button>
                                    <Button onClick={() => handleDelete(myProfileId)} color="inherit" size="small">
                                        Видалити
                                    </Button>
                                </>
                            )}
                            <IconButton color="inherit" size="small" onClick={() => setIsInfoOpen(false)}>
                                <Icon>close</Icon>
                            </IconButton>
                        </>
                    }
                    sx={{ mb: 2 }}
                >
                    {myProfileId === null ? (
                        "Ще не маєш облікового запису? Реєструйся!"
                    ) : (
                        "Ви можете змінити або видалити власний профіль користувача"
                    )}
                </Alert>
            </Collapse>
        </Box >
    );

    return (
        <>
            {renderInfoAlert}
            {myIsAdmin ? (
                <FullTable tableTitle="Таблиця профілів" addButtonName={null} columns={columns} data={data} rowId="profileId"
                    totalCount={totalCount} rowsPerPage={rowsPerPage} page={page} handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage} additionalCols={additionalCols}>
                    {(row) => (
                        <>
                            <TableCell key="roles">
                                {renderRoles(row)}
                            </TableCell>
                            <TableCell key="actions">
                                <IconButton onClick={() => handleDelete(row.profileId)}>
                                    <Icon>delete</Icon>
                                </IconButton>
                            </TableCell>
                        </>
                    )}
                </FullTable>
            ) : <Typography>Ви не можете переглянути список профілів усіх користувачів</Typography>}
            {(isUpdateDialogOpen && myProfileId !== null) &&
                <ProfileUpdate isUpdateDialogOpen={isUpdateDialogOpen} setIsUpdateDialogOpen={setIsUpdateDialogOpen}
                    setNeedRefetch={setNeedRefetch} />
            }
        </>
    );
}

export default ProfileList;
