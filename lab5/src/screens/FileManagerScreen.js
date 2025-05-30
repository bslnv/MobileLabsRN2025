import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import FileListItem from '../components/fileManager/FileListItem';
import CreateFileModal from '../components/fileManager/CreateFileModal';
import CreateFolderModal from '../components/fileManager/CreateFolderModal';
import InfoModal from '../components/fileManager/InfoModal';

export default function FileManagerScreen({ route, navigation }) {
    const { basePath } = route.params;
    const [currentPath, setCurrentPath] = useState(basePath);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isFileModalVisible, setFileModalVisible] = useState(false);
    const [isFolderModalVisible, setFolderModalVisible] = useState(false);
    const [isInfoModalVisible, setInfoModalVisible] = useState(false);
    const [selectedItemForInfo, setSelectedItemForInfo] = useState(null);

    useLayoutEffect(() => {
        let displayPath = currentPath.replace(FileSystem.documentDirectory, 'Documents/');
        if (displayPath.startsWith('Documents/AppData') && displayPath.length > "Documents/AppData".length + 1) {
            displayPath = "AppData/" + displayPath.substring("Documents/AppData/".length);
        } else if (displayPath === 'Documents/AppData') {
            displayPath = "AppData";
        }

        if (displayPath.length > 25) {
            displayPath = "..." + displayPath.slice(-22);
        }
        navigation.setOptions({ 
            title: displayPath,
            headerBackTitleVisible: false,
        });
    }, [navigation, currentPath]);

    const ensureDirExists = async (dirPath) => {
        const dirInfo = await FileSystem.getInfoAsync(dirPath);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
        }
    };

    const loadDirectoryContents = async (path) => {
        try {
            setIsLoading(true);
            await ensureDirExists(path);
            const result = await FileSystem.readDirectoryAsync(path);
            const detailedItems = await Promise.all(
                result.map(async (name) => {
                    const itemPath = `${path}/${name}`;
                    const info = await FileSystem.getInfoAsync(itemPath, { size: true, modificationTime: true });
                    return {
                        name,
                        isDirectory: info.isDirectory,
                        uri: info.uri,
                        size: info.size,
                        modificationTime: info.modificationTime,
                    };
                })
            );
            detailedItems.sort((a, b) => {
                if (a.isDirectory && !b.isDirectory) return -1;
                if (!a.isDirectory && b.isDirectory) return 1;
                return a.name.localeCompare(b.name);
            });
            setItems(detailedItems);
        } catch (error) {
            console.error('Error loading directory:', error);
            Alert.alert('Помилка', `Не вдалося завантажити вміст папки: ${path.split('/').pop()}`);
            if (path !== basePath && path !== FileSystem.documentDirectory) {
                goUpOneLevel();
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        ensureDirExists(basePath).then(() => {
            if (currentPath === basePath) { 
                 loadDirectoryContents(currentPath);
            } else {
                 setCurrentPath(basePath);
            }
        });
    }, [basePath]);

    useEffect(() => {
        if (currentPath) {
            loadDirectoryContents(currentPath);
        }
    }, [currentPath]);

    const handleItemPress = (item) => {
        if (item.isDirectory) {
            setCurrentPath(item.uri);
        } else {
            navigation.navigate('FileViewer', { fileUri: item.uri, fileName: item.name });
        }
    };

    const goUpOneLevel = () => {
        if (currentPath === basePath) return;
        if (currentPath === FileSystem.documentDirectory && basePath.startsWith(FileSystem.documentDirectory) && basePath !== FileSystem.documentDirectory ) {
        } else if (currentPath === FileSystem.documentDirectory && basePath === FileSystem.documentDirectory ) {
             return;
        } else if (currentPath === FileSystem.documentDirectory) {
            return;
        }
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        if (parentPath && parentPath.length >= basePath.length -1 && parentPath.startsWith(basePath.substring(0,basePath.lastIndexOf('/'))) ) {
            if(parentPath.length < basePath.length){
                setCurrentPath(basePath);
            } else {
                setCurrentPath(parentPath);
            }
        } else if (parentPath && parentPath.length >= FileSystem.documentDirectory.length -1 && parentPath.startsWith(FileSystem.documentDirectory.substring(0,FileSystem.documentDirectory.lastIndexOf('/'))) && basePath.startsWith(FileSystem.documentDirectory) ) {
             if(parentPath.length < FileSystem.documentDirectory.length){
                setCurrentPath(FileSystem.documentDirectory);
            } else {
                setCurrentPath(parentPath);
            }
        }
        else {
             setCurrentPath(basePath);
        }
    };

    const handleCreateFile = async (fileName, fileContent) => { 
        const filePath = `${currentPath}/${fileName}`; 
        try { 
            await FileSystem.writeAsStringAsync(filePath, fileContent, { encoding: FileSystem.EncodingType.UTF8 }); 
            setFileModalVisible(false); 
            loadDirectoryContents(currentPath); 
            Alert.alert('Успіх', `Файл "${fileName}" створено.`); 
        } catch (error) { 
            console.error('Error creating file:', error); 
            Alert.alert('Помилка', 'Не вдалося створити файл.'); 
        } 
    };
    
    const handleCreateFolder = async (folderName) => { 
        const folderPath = `${currentPath}/${folderName}`; 
        try { 
            await FileSystem.makeDirectoryAsync(folderPath); 
            setFolderModalVisible(false); 
            loadDirectoryContents(currentPath); 
            Alert.alert('Успіх', `Папку "${folderName}" створено.`); 
        } catch (error) { 
            console.error('Error creating folder:', error); 
            Alert.alert('Помилка', 'Не вдалося створити папку.'); 
        } 
    };

    const handleShowInfo = (item) => { 
        setSelectedItemForInfo(item); 
        setInfoModalVisible(true); 
    };
    
    const isEffectivelyAtRoot = () => {
        if (currentPath === basePath) return true;
        if (basePath === FileSystem.documentDirectory && currentPath === FileSystem.documentDirectory) return true;
        return false;
    };

    if (isLoading && items.length === 0 && currentPath === basePath && !currentPath.includes('AppData')) { 
        return (
            <SafeAreaView style={[styles.fullScreenCentered]} edges={['bottom', 'left', 'right']}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer} edges={['bottom', 'left', 'right']}>
            <View style={styles.navigationHeader}>
                <TouchableOpacity
                    onPress={goUpOneLevel}
                    style={styles.upButton}
                    disabled={isEffectivelyAtRoot()}
                >
                    <Ionicons
                        name="arrow-up-circle-outline"
                        size={28}
                        color={isEffectivelyAtRoot() ? theme.colors.disabled : theme.colors.primary} />
                    <Text
                        style={[
                            styles.upButtonText,
                            isEffectivelyAtRoot() && styles.disabledText
                        ]}
                    > Вгору</Text>
                </TouchableOpacity>
            </View>

            {isLoading && <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loadingIndicator} />}

            <FlatList
                data={items}
                renderItem={({item}) => <FileListItem item={item} onPressItem={handleItemPress} onShowInfo={handleShowInfo} /> }
                keyExtractor={(item) => item.uri}
                ListEmptyComponent={<Text style={styles.emptyListText}>Папка порожня</Text>}
                contentContainerStyle={{ paddingBottom: 80 }}
            />

            <View style={styles.bottomActionsContainer}>
                <TouchableOpacity style={[styles.actionButton, {backgroundColor: theme.colors.accentOrange}]} onPress={() => setFolderModalVisible(true)}>
                    <Ionicons name="folder-open-outline" size={20} color={theme.colors.surface} />
                    <Text style={styles.actionButtonText}>Нова папка</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, {backgroundColor: theme.colors.primary}]} onPress={() => setFileModalVisible(true)}>
                    <Ionicons name="document-text-outline" size={20} color={theme.colors.surface} />
                    <Text style={styles.actionButtonText}>Новий файл</Text>
                </TouchableOpacity>
            </View>
            
            <CreateFileModal 
                visible={isFileModalVisible}
                onClose={() => setFileModalVisible(false)}
                onCreate={handleCreateFile}
            />
            <CreateFolderModal
                visible={isFolderModalVisible}
                onClose={() => setFolderModalVisible(false)}
                onCreate={handleCreateFolder}
            />
            <InfoModal
                visible={isInfoModalVisible}
                onClose={() => setInfoModalVisible(false)}
                item={selectedItemForInfo}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaContainer: { 
        flex: 1, 
        backgroundColor: theme.colors.background 
    },
    fullScreenCentered: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: theme.colors.background 
    },
    navigationHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: theme.spacing.medium, 
        paddingVertical: theme.spacing.small, 
        backgroundColor: theme.colors.surface, 
        borderBottomWidth: 1, 
        borderBottomColor: theme.colors.borderColor 
    },
    upButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingRight: theme.spacing.medium 
    },
    upButtonText: { 
        fontSize: theme.typography.button, 
        color: theme.colors.primary, 
        marginLeft: theme.spacing.small 
    },
    disabledText: { 
        color: theme.colors.disabled 
    },
    loadingIndicator: {
        marginVertical: theme.spacing.small,
    },
    emptyListText: { 
        textAlign: 'center', 
        marginTop: theme.spacing.xlarge * 2, 
        fontSize: theme.typography.body, 
        color: theme.colors.textSecondary 
    },
    bottomActionsContainer: { 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        paddingVertical: theme.spacing.medium, 
        paddingHorizontal: theme.spacing.medium, 
        backgroundColor: theme.colors.surface, 
        borderTopWidth: 1, 
        borderTopColor: theme.colors.borderColor,
        elevation: 4,
        shadowColor: theme.colors.text,
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    actionButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: theme.spacing.small + 2, 
        paddingHorizontal: theme.spacing.medium, 
        borderRadius: 8, 
        elevation: 2, 
    },
    actionButtonText: { 
        color: theme.colors.surface, 
        fontSize: theme.typography.button - 1, 
        fontWeight: '600', 
        marginLeft: theme.spacing.small 
    },
});