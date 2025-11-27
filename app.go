package main

import (
	"context"
	"os"
	"path/filepath"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// OpenFileDialog opens a file dialog and returns the selected file path
func (a *App) OpenFileDialog() string {
	selection, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select a file",
	})
	if err != nil {
		return ""
	}
	return selection
}

// ReadFileContents reads the contents of a file from the given path
func (a *App) ReadFileContents(filePath string) (string, error) {
	contents, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}

	return string(string(contents)), nil
}

// DirectoryItem represents a file or directory in the file system
type DirectoryItem struct {
	Name    string `json:"name"`
	Path    string `json:"path"`
	IsDir   bool   `json:"isDir"`
	Size    int64  `json:"size"`
	ModTime string `json:"modTime"`
}

// OpenDirectoryDialog opens a directory dialog and returns the selected directory path
func (a *App) OpenDirectoryDialog() string {
	selection, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select a directory",
	})
	if err != nil {
		return ""
	}
	return selection
}

// ListDirectory returns a list of files and directories recursively in the given path
func (a *App) ListDirectory(path string) ([]DirectoryItem, error) {
	var items []DirectoryItem

	err := filepath.Walk(path, func(walkPath string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}

		// Skip the root directory itself
		if walkPath == path {
			return nil
		}

		item := DirectoryItem{
			Name:    info.Name(),
			Path:    walkPath,
			IsDir:   info.IsDir(),
			Size:    info.Size(),
			ModTime: info.ModTime().Format(time.RFC3339),
		}

		items = append(items, item)
		return nil
	})

	if err != nil {
		return nil, err
	}

	return items, nil
}

// GetFileInfo returns file metadata for the given path
func (a *App) GetFileInfo(filePath string) (DirectoryItem, error) {
	info, err := os.Stat(filePath)
	if err != nil {
		return DirectoryItem{}, err
	}

	return DirectoryItem{
		Name:    filepath.Base(filePath),
		Path:    filePath,
		IsDir:   info.IsDir(),
		Size:    info.Size(),
		ModTime: info.ModTime().Format(time.RFC3339),
	}, nil
}
